import React from 'react';

const DatenschutzContent: React.FC = () => {
    return (
        <div className="space-y-4 text-base leading-relaxed">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Stand:</strong> November 2026
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Name und Anschrift des Verantwortlichen</h3>
            <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO), des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes (TDDDG) und sonstiger datenschutzrechtlicher Bestimmungen ist:
            </p>
            <p>
                Pascal Pander<br />
                Bahnhofstraße 39<br />
                78532 Tuttlingen<br />
                E-Mail: <a href="mailto:pascalpander@by-dp.de" className="text-cyan-600 dark:text-cyan-400 hover:underline">pascalpander@by-dp.de</a>
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Kontaktmöglichkeit</h3>
            <p>
                Bei Fragen zum Datenschutz auf dieser Website können Sie uns jederzeit unter der folgenden E-Mail-Adresse kontaktieren:<br />
                <a href="mailto:pascalpander@by-dp.de" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">pascalpander@by-dp.de</a>
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Allgemeines zur Datenverarbeitung und Rechtsgrundlagen</h3>
            <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre personenbezogenen Daten ausschließlich im Rahmen der gesetzlichen Bestimmungen, insbesondere der DSGVO und des TDDDG.
            </p>
            <p>
                Grundsätzlich gilt das Verbot mit Erlaubnisvorbehalt. Soweit wir personenbezogene Daten verarbeiten, stützen wir uns auf folgende Rechtsgrundlagen:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                    <strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG):</strong> Sofern Sie uns eine ausdrückliche Einwilligung erteilt haben.
                </li>
                <li>
                    <strong>Vertragserfüllung oder vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO):</strong> Wenn die Datenverarbeitung zur Bereitstellung gewünschter Services erforderlich ist.
                </li>
                <li>
                    <strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO):</strong> Sofern eine rechtliche Pflicht zur Verarbeitung besteht.
                </li>
                <li>
                    <strong>Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO):</strong> Wenn die Verarbeitung zur Wahrung unserer berechtigten Interessen erforderlich ist und keine überwiegenden schutzwürdigen Interessen der betroffenen Person entgegenstehen.
                </li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">4. Ihre Rechte als betroffene Person</h3>
            <p>
                Ihnen stehen nach der DSGVO folgende Rechte bezüglich Ihrer verarbeiteten Daten zu:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                    <strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können jederzeit Auskunft über die von uns zu Ihrer Person verarbeiteten Daten verlangen.
                </li>
                <li>
                    <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht auf unverzügliche Berichtigung unrichtiger oder Vervollständigung unvollständiger personenbezogener Daten.
                </li>
                <li>
                    <strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können unter den gesetzlichen Voraussetzungen die unverzügliche Löschung Ihrer Daten verlangen.
                </li>
                <li>
                    <strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen, z. B. für die Dauer einer Prüfung im Falle eines Bestreitens der Richtigkeit.
                </li>
                <li>
                    <strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Daten, die Sie uns bereitgestellt haben, in einem gängigen, maschinenlesbaren Format zu erhalten oder an einen Dritten übermitteln zu lassen.
                </li>
                <li>
                    <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit die Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) beruht, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch einzulegen.
                </li>
                <li>
                    <strong>Widerrufsrecht bei Einwilligungen (Art. 7 Abs. 3 DSGVO):</strong> Eine einmal erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.
                </li>
                <li>
                    <strong>Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO):</strong> Sie haben unbeschadet anderer Rechtsbehelfe das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt. Zuständig ist in der Regel die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder unseres Sitzes (in Baden-Württemberg: Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg).
                </li>
            </ul>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">5. Hosting und Server-Logfiles (GitHub Pages)</h3>
            <p>
                Unsere Website wird über <strong>GitHub Pages</strong> bereitgestellt. Anbieter ist die GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA (bzw. für Nutzer im EWR: GitHub B.V., Prins Bernhardplein 200, 1097 JB Amsterdam, Niederlande).
            </p>
            <p>
                Beim Aufruf unserer Website erfasst GitHub automatisch Informationen in Server-Logfiles, die Ihr Browser übermittelt. Dies umfasst insbesondere:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>IP-Adresse des anfragenden Geräts</li>
                <li>Datum und Uhrzeit des Abrufs</li>
                <li>Name und URL der abgerufenen Datei / Unterseite</li>
                <li>Übertragene Datenmenge</li>
                <li>Zugriffsstatus / HTTP-Statuscode</li>
                <li>Referrer-URL (die zuvor besuchte Seite)</li>
                <li>Browsertyp und -version sowie Betriebssystem</li>
            </ul>
            <p>
                GitHub protokolliert diese Daten, um die Stabilität, Sicherheit und fehlerfreie Auslieferung der Dienste zu gewährleisten. Wir haben keinen direkten Zugriff auf diese Logfiles und führen keine personenbezogene Auswertung oder Zusammenführung mit anderen Datenquellen durch.
            </p>
            <p>
                Die Datenverarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an einer sicheren, schnellen und zuverlässigen Bereitstellung unserer Website gemäß Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">6. SSL- bzw. TLS-Verschlüsselung (HTTPS)</h3>
            <p>
                Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile. Wenn die Verschlüsselung aktiviert ist, können Daten, die Sie übermitteln, nicht von Dritten mitgelesen werden.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">7. Lokale Speichertechnologien (localStorage) &amp; Cookie-Hinweis</h3>
            <p>
                Unsere Website setzt keine klassischen Tracking-, Marketing- oder Werbe-Cookies ein. Zur Bereitstellung nutzerfreundlicher Grundfunktionen greifen wir auf den lokalen Speicher Ihres Browsers (<code>localStorage</code>) zurück.
            </p>
            <p>
                Darin werden ausschließlich folgende rein technische Einstellungen gespeichert:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                    <strong>Cookie-/Datenschutz-Status:</strong> Speichert die Kenntnisnahme des Hinweises, damit der Dialog bei weiteren Aufrufen nicht erneut eingeblendet wird.
                </li>
                <li>
                    <strong>Theme-Einstellung (Dark-/Lightmode):</strong> Speichert Ihre bevorzugte Ansicht der Website (helles oder dunkles Design).
                </li>
            </ul>
            <p>
                Der Zugriff auf den lokalen Speicher erfolgt ausschließlich für technisch erforderliche Funktionen zur Bereitstellung des von Ihnen ausdrücklich gewünschten Dienstes gemäß § 25 Abs. 2 Nr. 2 TDDDG. Eine Verarbeitung zu Marketing- oder Analysezwecken oder eine Weitergabe an Dritte findet nicht statt.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">8. Lokale Bereitstellung von Schriften und Assets</h3>
            <p>
                Alle auf dieser Website verwendeten Schriften, Icons und Skripte werden lokal über unser eigenes GitHub-Pages-Projekt ausgeliefert. Es erfolgt kein dynamisches Nachladen von externen Schriftenservern (wie Google Fonts) oder Drittanbieter-CDNs. Dadurch werden beim Laden der Website keine personenbezogenen Daten an externe Schriftanbieter übermittelt.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">9. Verlinkte Anwendungen und externe Dienste</h3>
            <p>
                Unsere Website <code>by-dp.de</code> fungiert unter anderem als Launcher und Übersicht für verschiedene eigenständige Web-Anwendungen (z. B. <code>by-dp.de/Party-Games</code>).
            </p>
            <p>
                Bitte beachten Sie, dass für verlinkte externe Angebote oder separate Anwendungen jeweils die dort hinterlegten, spezifischen Datenschutzerklärungen und Bestimmungen gelten.
            </p>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">10. Weitergabe von Daten</h3>
            <p>
                Eine Übermittlung Ihrer personenbezogenen Daten an Dritte zu anderen als den in dieser Datenschutzerklärung aufgeführten Zwecken findet nicht statt. Wir setzen weder externe Tracking-Dienste, Werbenetzwerke noch Social-Media-Plugins ein.
            </p>
        </div>
    );
};

export default DatenschutzContent;
