import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { sendOTPEmail, generateOTP } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();

    // Validasi input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check apakah user sudah terverifikasi
    if (userId) {
      const { data: existingVerification } = await supabase
        .from('otp_verifications')
        .select('is_verified')
        .eq('user_id', userId)
        .eq('is_verified', true)
        .maybeSingle();

      if (existingVerification) {
        return NextResponse.json(
          { error: 'User already verified' },
          { status: 400 }
        );
      }
    }

    // Rate limiting: Check jika ada OTP yang baru dibuat dalam 1 menit terakhir
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentOTP } = await supabase
      .from('otp_verifications')
      .select('created_at')
      .eq('email', email)
      .gte('created_at', oneMinuteAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentOTP) {
      return NextResponse.json(
        {
          error: 'Please wait 1 minute before requesting a new OTP',
          retryAfter: 60
        },
        { status: 429 }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit dari sekarang

    // Gunakan admin client untuk bypass RLS saat insert
    try {
      const adminClient = createAdminClient();
      const { error: insertError } = await adminClient
        .from('otp_verifications')
        .insert({
          user_id: userId || null,
          email,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString(),
          is_verified: false,
          attempts: 0,
        });

      if (insertError) {
        console.error('Error inserting OTP:', insertError);
        return NextResponse.json(
          { error: 'Failed to create OTP', details: insertError.message },
          { status: 500 }
        );
      }
    } catch (adminError) {
      console.error('Error creating admin client:', adminError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Kirim email OTP
    const emailResult = await sendOTPEmail(email, otpCode);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP email', details: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600, // 10 menit dalam detik
    });

  } catch (error) {
    console.error('Error in OTP send route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
