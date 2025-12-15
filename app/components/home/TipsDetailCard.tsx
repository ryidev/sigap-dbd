import React, { ReactNode } from 'react';

export interface TipsDetailCardProps {
    icon: ReactNode;
    title: string;
    items: string[];
    variant?: 'red' | 'yellow';
}

export default function TipsDetailCard({ icon, title, items, variant = 'red' }: TipsDetailCardProps) {
    const isRed = variant === 'red';

    const bgColor = isRed ? 'bg-red-50' : 'bg-yellow-50';
    const borderColor = isRed ? 'border-red-200' : 'border-yellow-200';
    const iconBgColor = isRed ? 'bg-red-100' : 'bg-yellow-100';
    const titleColor = isRed ? 'text-red-800' : 'text-yellow-800';
    const listColor = isRed ? 'text-red-700' : 'text-yellow-700';
    const bulletColor = isRed ? 'bg-red-500' : 'bg-yellow-500';

    return (
        <div className={`${bgColor} rounded-xl p-6 border ${borderColor} h-full`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
                    {icon}
                </div>
                <h3 className={`text-lg font-semibold ${titleColor}`}>{title}</h3>
            </div>
            <ul className={`space-y-2 text-sm ${listColor}`}>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 ${bulletColor} rounded-full flex-shrink-0`}></span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
