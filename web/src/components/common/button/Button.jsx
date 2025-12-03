import React from 'react';
import './Button.css';
import { Plus, Loader, Flag, FileBarChartIcon } from 'lucide-react'; // Import specific icons

const Button = ({ title, backgroundColor = '#76AE54', onClick, icon }) => {
    // Map icon strings to Lucide components
    const iconComponents = {
        plus: Plus,
        loader: Loader,
        flag: Flag,
        FileBarChartIcon: FileBarChartIcon // Using Flag for "report" sign
    };

    const IconComponent = icon ? iconComponents[icon] : null;

    return (
        <button
            className="dynamic-button"
            style={{ backgroundColor }}
            onClick={onClick}
        >
            {IconComponent && <IconComponent size={16} style={{ marginRight: '8px' }} />}
            {title}
        </button>
    );
};

export default Button;