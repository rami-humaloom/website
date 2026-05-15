(function () {
    const isProdHost =
        window.location.hostname === 'humaloom.ai' ||
        window.location.hostname === 'www.humaloom.ai';

    if (!isProdHost) {
        window.gtag = function () {};
        console.log('Google Analytics disabled on non-production host.');
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-X50SZDRJ36');

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-X50SZDRJ36';
    document.head.appendChild(s);
}());
