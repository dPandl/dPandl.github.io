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
                E-Mail: <a href="mailto:pascalpander@by-dp.de" className="text-cyan-600 dark:text-cyan-400 hover:underline">pascalpander@by-dp.de</a>
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Haftung für Inhalte</h3>
            <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Haftung für Links</h3>
            <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Urheberrecht</h3>
            <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>

            <p className="pt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                Stand: November 2026
            </p>
        </div>
    );
};

export default ImpressumContent;
