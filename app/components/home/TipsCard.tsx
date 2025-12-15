import React, { ReactNode } from 'react';

export interface TipsCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    footerText: string;
}

export default function TipsCard({ icon, title, description, footerText }: TipsCardProps) {
    return (
        <div className="group bg-red-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-red-200 h-full flex flex-col">
            <div className="text-center flex-grow">
                <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    {icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {description}
                </p>
            </div>
            <div className="text-xs text-red-700 font-medium text-center mt-auto border-t border-red-100 pt-3">
                {footerText}
            </div>
        </div>
    );
}
