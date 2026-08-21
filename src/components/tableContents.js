export default function TableOfContents({ items, pathname }) {
    if (!items || items.length === 0) return null;

    const renderItems = (itemsArray) => {
        return itemsArray.map((item, index) => (
            <div key={index}>
                <a
                    href={`#${pathname}#${item.id}`}
                    className={`postChapter postChapter-${item.level}`}
                    onClick={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                            if (!item.id) return; // защита от пустого id
                            const el = document.getElementById(item.id);
                            if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 50);
                    }}
                >
                    {item.text}
                </a>
                {item.children && item.children.length > 0 && renderItems(item.children)}
            </div>
        ));
    };

    return (
        <div className="tocContainer">
            {renderItems(items)}
        </div>
    );
}