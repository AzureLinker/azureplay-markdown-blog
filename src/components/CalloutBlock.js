import React, { useState, useMemo, cloneElement } from 'react';

export default function CalloutBlock({ children, ...props }) {
    const childrenArray = React.Children.toArray(children);

    const matchResult = useMemo(() => {
        const firstParagraph = childrenArray.find(
            child => child?.type === 'p' || child?.props?.node?.tagName === 'p'
        );

        if (!firstParagraph) return null;

        const textContent = extractText(firstParagraph);

        if (typeof textContent === 'string') {
            const match = textContent.match(/^\[!(\w+)\]\s*(-)?\s*(.*)/);
            if (match) {
                return {
                    calloutType: match[1],
                    collapsed: match[2] === '-',
                    title: match[3] || match[1],
                    firstParagraph,
                    firstParagraphIndex: childrenArray.indexOf(firstParagraph),
                    fullMatch: match[0], // вся строка "[!warning] Важно"
                };
            }
        }
        return null;
    }, [childrenArray]);

    const [isOpen, setIsOpen] = useState(() => {
        return matchResult ? !matchResult.collapsed : true;
    });

    if (!matchResult) {
        return <blockquote {...props}>{children}</blockquote>;
    }

    const { calloutType, title, firstParagraph, firstParagraphIndex, fullMatch } = matchResult;

    // Из первого параграфа удаляем строку "[!warning] Важно"
    const cleanedFirstParagraph = removePrefixFromParagraph(firstParagraph, fullMatch);

    // Собираем тело: изменённый первый параграф (если есть текст) + остальные дети
    const bodyChildren = [];
    if (cleanedFirstParagraph) {
        bodyChildren.push(cleanedFirstParagraph);
    }
    childrenArray.forEach((child, index) => {
        if (index !== firstParagraphIndex) {
            bodyChildren.push(child);
        }
    });

    return (
        <div className={`callout callout-${calloutType}`}>
            <div
                className="callout-header"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <span className="callout-icon" />
                <span className="callout-title">{title}</span>
                <span className="callout-arrow">{isOpen ? '▾' : '▸'}</span>
            </div>
            {isOpen && (
                <div className="callout-body">
                    {bodyChildren.length > 0 ? bodyChildren : null}
                </div>
            )}
        </div>
    );
}

function extractText(element) {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return String(element);
    if (!element) return '';
    if (element.props?.children) {
        if (Array.isArray(element.props.children)) {
            return element.props.children.map(extractText).join('');
        }
        return extractText(element.props.children);
    }
    return '';
}

// Удаляет префикс из первого текстового ребёнка параграфа
function removePrefixFromParagraph(paragraph, prefix) {
    if (!paragraph || !paragraph.props?.children) return null;

    const children = Array.isArray(paragraph.props.children)
        ? paragraph.props.children
        : [paragraph.props.children];

    // Ищем первый текстовый узел, который содержит префикс
    const newChildren = [];
    let removed = false;

    for (const child of children) {
        if (!removed && typeof child === 'string' && child.trimStart().startsWith(prefix)) {
            // Удаляем префикс из строки
            const newText = child.replace(prefix, '').replace(/^\n\s*/, '');
            if (newText.trim()) {
                newChildren.push(newText);
            }
            removed = true;
        } else if (!removed && typeof child === 'string') {
            // Может быть случай, когда текст разбит на части
            const fullText = children.filter(c => typeof c === 'string').join('');
            if (fullText.trimStart().startsWith(prefix)) {
                const remaining = fullText.replace(prefix, '').replace(/^\n\s*/, '');
                if (remaining.trim()) {
                    newChildren.push(remaining);
                }
                removed = true;
                continue;
            }
            newChildren.push(child);
        } else {
            newChildren.push(child);
        }
    }

    if (newChildren.length === 0) return null;

    return cloneElement(paragraph, {}, ...newChildren);
}