import React from 'react';

const ImpressumContent: React.FC = () => {
    return (
        <div className="space-y-4 text-base leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</h3>
            <p>
                Pascal Pander<br />
                Bahnhofstraße 39<br />
                78532 Tuttlingen
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Kontakt</h3>
            <p>
                E-Mail: pascalpander@by-dp.de
            </p>
        </div>
    );
};

export default ImpressumContent;