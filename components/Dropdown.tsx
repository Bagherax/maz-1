import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: Option[];
  selected: Option;
  onSelect: (option: Option) => void;
  label?: ReactNode;
  trigger?: React.ReactNode;
  menuClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect, label, trigger, menuClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    if (option.disabled) return;
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && <label className="block text-sm font-medium mb-1" style={{ color: 'var(--auth-color-text)' }}>{label}</label>}
      
      {trigger ? (
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          className="relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-sm sm:text-sm transition-colors duration-200 border"
          style={{
            backgroundColor: 'var(--auth-color-background)',
            borderColor: 'var(--auth-color-border)',
            color: 'var(--auth-color-text)'
          }}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center">
            {selected.icon && <span className="mr-2">{selected.icon}</span>}
            <span className="block truncate">{selected.label}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 7.03 7.78a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.28a.75.75 0 011.06 0L10 15.19l2.97-2.91a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      )}

      {isOpen && (
        <ul
          className={`absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${menuClassName}`}
          style={{
            backgroundColor: 'var(--auth-color-background)',
            borderColor: 'var(--auth-color-border)',
          }}
          tabIndex={-1}
          role="listbox"
          aria-labelledby="listbox-label"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`relative select-none py-2 pl-3 pr-9 ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default hover:bg-gray-500/10'}`}
              style={{ color: 'var(--auth-color-text)' }}
              id={`listbox-option-${option.value}`}
              role="option"
              aria-selected={option.value === selected.value}
              aria-disabled={option.disabled}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-center">
                {option.icon && <span className="mr-2">{option.icon}</span>}
                <span className={`block truncate ${option.value === selected.value ? 'font-semibold' : 'font-normal'}`}>
                  {option.label}
                </span>
              </div>

              {option.value === selected.value && !option.disabled && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4" style={{ color: 'var(--auth-color-primary)' }}>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;