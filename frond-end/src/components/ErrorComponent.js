import React, { useState } from 'react';

const ErrorComponent = ({ message, clearError }) => {
    return (
        <div className="error">
            <p>{message}</p>
            <button onClick={clearError}>Close</button>
        </div>
    );
};

export default ErrorComponent;
