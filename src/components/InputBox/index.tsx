import {ChangeEvent, Dispatch, forwardRef, SetStateAction, KeyboardEvent } from 'react';
import './style.css'

// interface: Input Box Component Properties
interface Props {
    label: string;
    type: 'text' | 'password';
    error: boolean;
    placeholder: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    onButtonClick?: () => void;
    message?: string;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

// * Component: Input Box Component
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    // * State: Properties
    const { label, type, error, placeholder, value, icon, message } = props;
    const { setValue, onButtonClick, onKeyDown } = props;
    
    // * Event Handler: input 값 변경 이벤트 핸들러
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue(value);
    }

    // * Event Handler: input 키 이벤트 핸들러
    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }

    // * Render: Input Box Component Rendering
    return (
        <div className='inputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>
                <input ref={ref} className='input' type={type} placeholder={placeholder} value={value} onChange={onChangeHandler} onKeyDown={onKeyDownHandler} />
                {onButtonClick !== undefined && (
                    <div className='icon-button' onClick={onButtonClick}>
                        { icon !== undefined && <div className={`icon ${icon}`}></div> }
                    </div>
                )}

            </div>
            { message !== undefined && <div className='inputbox-message'>{message}</div> }

        </div>
    )
});

export default InputBox;
