import { useState } from 'react';

const useStrDe = () => {
    const [isVisible, setIsVisible] = useState(false);

    function toggle() {
        setIsVisible(!isVisible);
    }

    return {
        isVisible: isVisible,
        toggle,
    }
};

export default useStrDe;