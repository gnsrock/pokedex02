import React from 'react';
import TypeColors from '../../theme/TypeColors';
import TypeTranslations from '../../theme/TypeTranslations';
import './TypeFilterBar.scss';

const types = Object.keys(TypeColors);

function TypeFilterBar({ onTypeSelect, selectedTypes = [] }) {
    const isLimitReached = selectedTypes.length >= 2;

    return (
        <div className="type-filter-bar-container">
            <div className="type-buttons-grid">
                {types.map((type) => {
                    const isActive = selectedTypes.includes(type);
                    return (
                        <button
                            key={type}
                            className={`type-filter-btn ${isActive ? 'active' : ''} ${isLimitReached && !isActive ? 'disabled' : ''}`}
                            style={{
                                '--type-color': TypeColors[type],
                                borderColor: TypeColors[type]
                            }}
                            onClick={() => onTypeSelect(type)}
                            disabled={isLimitReached && !isActive}
                            title={isLimitReached && !isActive ? "Máximo 2 tipos permitidos" : ""}
                        >
                            <span className="type-dot"></span>
                            <span className="type-name">{TypeTranslations[type] || type}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default TypeFilterBar;
