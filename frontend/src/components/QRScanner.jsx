import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

const QRScanner = ({ onScanSuccess, onScanFailure }) => {
    const [scannerInitialized, setScannerInitialized] = useState(false);

    useEffect(() => {
        // Prevent multiple initializations
        if (scannerInitialized) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        const successCallback = (decodedText, decodedResult) => {
            scanner.clear();
            onScanSuccess(decodedText, decodedResult);
        };

        const errorCallback = (error) => {
            if (onScanFailure) {
                onScanFailure(error);
            } else {
                // Ignore errors by default as scanning produces many errors per second while seeking
            }
        };

        scanner.render(successCallback, errorCallback);
        setScannerInitialized(true);

        // Cleanup
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    return (
        <div className="qr-scanner-container">
            <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--gray-600)' }}>
                Point your camera at a QR code
            </p>
        </div>
    );
};

export default QRScanner;
