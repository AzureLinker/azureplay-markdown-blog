import React from 'react';

function Guestbook() {
    const atabookId = 'azureplay';
    
    return (
        <div className="windowBase">
            <div className="windowName">
                <span>Atabook</span>
            </div>
            <div className="windowContent">
                <iframe
                    src={`https://${atabookId}.atabook.org`}
                    title="Гостевая книга"
                    style={{
                        width: '100%',
                        height: '700px',
                        border: 'none',
                    }}
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default Guestbook;