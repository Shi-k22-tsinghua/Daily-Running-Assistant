// debug-utils.js
const DEBUG_MODE = {
    NONE: 0,
    ERRORS_ONLY: 1,
    FULL: 2
};

// Configure debug level based on environment
const getDebugLevel = () => {
    // Check if running in development environment
    // You can customize these conditions based on your setup
    if (typeof __wxConfig !== 'undefined' && __wxConfig.debug) {
        return DEBUG_MODE.FULL;
    }
    
    // For production, only show critical errors
    return DEBUG_MODE.ERRORS_ONLY;
};

const showDebugInfo = (title, content, forceShow = false) => {
    const debugLevel = getDebugLevel();
    
    // Log to console regardless of environment
    console.log(`[DEBUG] ${title}:`, content);
    
    // Show modal only in appropriate debug levels or if forced
    if (debugLevel === DEBUG_MODE.FULL || forceShow) {
        wx.showModal({
            title: title,
            content: typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
            showCancel: false
        });
    }
};

const showErrorInfo = (title, error) => {
    const debugLevel = getDebugLevel();
    
    // Always log errors to console
    console.error(`[ERROR] ${title}:`, error);
    
    // For production (ERRORS_ONLY), show a user-friendly message
    if (debugLevel === DEBUG_MODE.ERRORS_ONLY) {
        let errorMessage = '操作失败';
        if (error.errMsg) {
            if (error.errMsg.includes('fail timeout')) {
                errorMessage = '连接超时，请稍后重试';
            } else if (error.errMsg.includes('fail domain')) {
                errorMessage = '网络连接异常';
            } else if (error.errMsg.includes('fail ssl')) {
                errorMessage = '安全连接失败';
            }
        }
        
        wx.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 3000
        });
    } 
    // For development (FULL), show detailed error information
    else if (debugLevel === DEBUG_MODE.FULL) {
        wx.showModal({
            title: title,
            content: JSON.stringify({
                message: error.message || error.errMsg,
                stack: error.stack,
                details: error
            }, null, 2),
            showCancel: false
        });
    }
};

module.exports = {
    DEBUG_MODE,
    showDebugInfo,
    showErrorInfo,
    getDebugLevel
};