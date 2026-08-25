import PropTypes from 'prop-types';
import React from 'react';

import styles from './assets-tab.css';

const AssetsTab = props => {
    const {
        assets,
        selectedIndex,
        onSelect,
        title
    } = props;

    return (
        <section className={styles.wrapper} aria-label={title}>
            <header className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <span className={styles.count}>{assets.length}</span>
            </header>
            {assets.length ? (
                <div className={styles.grid} role="list">
                    {assets.map((asset, index) => (
                        <button
                            key={asset.id || `${asset.name}-${index}`}
                            type="button"
                            className={`${styles.item} ${index === selectedIndex ? styles.selected : ''}`}
                            onClick={() => onSelect(index)}
                            aria-pressed={index === selectedIndex}
                            title={asset.name}
                        >
                            <div className={styles.preview}>
                                {asset.thumbnail ? (
                                    <img
                                        className={styles.thumbnail}
                                        src={asset.thumbnail}
                                        alt=""
                                    />
                                ) : (
                                    <span className={styles.placeholder} aria-hidden="true">
                                        {asset.type || 'ASSET'}
                                    </span>
                                )}
                            </div>
                            <span className={styles.name}>{asset.name}</span>
                            {asset.details ? (
                                <span className={styles.details}>{asset.details}</span>
                            ) : null}
                        </button>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <div className={styles.emptyTitle}>No assets yet</div>
                    <div className={styles.emptyText}>Upload or create an asset to see it here.</div>
                </div>
            )}
        </section>
    );
};

AssetsTab.propTypes = {
    assets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
        type: PropTypes.string,
        details: PropTypes.string
    })),
    onSelect: PropTypes.func,
    selectedIndex: PropTypes.number,
    title: PropTypes.string
};

AssetsTab.defaultProps = {
    assets: [],
    onSelect: () => {},
    selectedIndex: -1,
    title: 'Assets'
};

export default AssetsTab;
