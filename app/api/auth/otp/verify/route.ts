import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode } = await request.json();

    // Validasi input
    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    // Validasi format OTP (6 digit)
    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Must be 6 digits' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Cari OTP yang valid (belum expired dan belum verified)
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otpCode)
      .eq('is_verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      // Check apakah OTP sudah expired
      const { data: expiredOTP } = await supabase
        .from('otp_verifications')
        .select('expires_at')
        .eq('email', email)
        .eq('otp_code', otpCode)
        .single();

      if (expiredOTP) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new one' },
          { status: 400 }
        );
      }

      // Check attempts untuk OTP ini
      const { data: latestOTP } = await supabase
        .from('otp_verifications')
        .select('id, attempts')
        .eq('email', email)
        .eq('is_verified', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestOTP) {
        const newAttempts = (latestOTP.attempts || 0) + 1;

        // Update attempts
        await supabase
          .from('otp_verifications')
          .update({ attempts: newAttempts })
          .eq('id', latestOTP.id);

        if (newAttempts >= MAX_ATTEMPTS) {
          return NextResponse.json(
            {
              error: 'Maximum verification attempts exceeded. Please request a new OTP',
              attemptsRemaining: 0
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            error: 'Invalid OTP code',
            attemptsRemaining: MAX_ATTEMPTS - newAttempts
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: 'Maximum verification attempts exceeded. Please request a new OTP',
          attemptsRemaining: 0
        },
        { status: 400 }
      );
    }

    // OTP valid! Update status
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP verification:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    // Jika user_id ada, update metadata user di Supabase Auth
    if (otpRecord.user_id) {
      try {
        const adminClient = createAdminClient();
        const { error: userUpdateError } = await adminClient.auth.admin.updateUserById(
          otpRecord.user_id,
          {
            email_confirm: true,
            user_metadata: {
              email_verified: true,
              otp_verified_at: new Date().toISOString(),
            }
          }
        );

        if (userUpdateError) {
          console.error('Error updating user metadata:', userUpdateError);
          // Continue anyway, OTP is verified
        }
      } catch (adminError) {
        console.error('Error creating admin client:', adminError);
        // Continue anyway, OTP is verified in our database
      }
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      userId: otpRecord.user_id,
    });

  } catch (error) {
    console.error('Error in OTP verify route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint untuk check status verifikasi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check apakah user sudah verified
    const { data: verification, error: queryError } = await supabase
      .from('otp_verifications')
      .select('is_verified, verified_at')
      .eq('email', email)
      .eq('is_verified', true)
      .order('verified_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Ignore error jika tidak ada data (user belum verified)
    return NextResponse.json({
      verified: !!verification,
      verifiedAt: verification?.verified_at || null,
    });

  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
