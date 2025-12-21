import * as React from "react";
import Input from "../input/input";
import { ChevronDownIcon } from "../icons";
import { LoadingIcon } from "../icons";
import "./autocomplete.scss";

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface RenderOptionProps {
  option: AutocompleteOption;
  isHighlighted: boolean;
  isSelected: boolean;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
}

const ClearIcon = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  loading = false,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isKeyboardNavigationRef = React.useRef(false);

  // Find the selected option's label
  const selectedOption = React.useMemo(() => options.find((opt) => opt.value === value) || null, [options, value]);

  // Filter options based on input value
  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) {
      return options;
    }
    const lowerInput = inputValue.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(lowerInput));
  }, [options, inputValue]);

  // Update input value when selected value changes from outside (only when closed)
  React.useEffect(() => {
    if (!isOpen) {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else {
        setInputValue("");
      }
    }
  }, [selectedOption, isOpen]);

  // Close dropdown on outside click (SSR-safe) and restore selected value
  React.useEffect(() => {
    if (!isOpen) {
      // Restore selected value label when closing
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else {
        setInputValue("");
      }
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    // Use setTimeout to ensure this runs after the click event that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, selectedOption]);

  // Scroll highlighted option into view
  React.useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleInputChange = (newValue: string | number) => {
    const strValue = String(newValue);
    setInputValue(strValue);
    setIsOpen(true);
    setHighlightedIndex(-1);

    // If input matches an option exactly, select it
    const exactMatch = options.find((opt) => opt.label.toLowerCase() === strValue.toLowerCase());
    if (exactMatch) {
      onChange(exactMatch.value);
    } else {
      // Clear selection if input doesn't match
      onChange("");
    }
  };

  const handleInputFocus = () => {
    // Clear input when opening to allow fresh filtering
    setInputValue("");
    setHighlightedIndex(-1);
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      setIsOpen(true);
      // Find selected item index in filtered list
      const selectedIndex = value ? filteredOptions.findIndex((opt) => opt.value === value) : -1;
      if (e.key === "ArrowDown") {
        // Start from selected item if it exists, otherwise from top
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else if (e.key === "ArrowUp") {
        // Start from selected item if it exists, otherwise from bottom
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : filteredOptions.length - 1);
      }
      return;
    }

    // Find selected item index in filtered list for navigation
    const selectedIndex = value ? filteredOptions.findIndex((opt) => opt.value === value) : -1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        isKeyboardNavigationRef.current = true;
        setHighlightedIndex((prev) => {
          // If nothing is highlighted, start from selected item (if exists) or top
          if (prev < 0) {
            return selectedIndex >= 0 ? selectedIndex : 0;
          }
          // Always move down from current highlighted index (works with mouse hover too)
          const nextIndex = prev + 1;
          return nextIndex < filteredOptions.length ? nextIndex : 0; // Wrap to first
        });
        // Reset keyboard navigation flag after a short delay
        setTimeout(() => {
          isKeyboardNavigationRef.current = false;
        }, 100);
        break;

      case "ArrowUp":
        e.preventDefault();
        isKeyboardNavigationRef.current = true;
        setHighlightedIndex((prev) => {
          // If nothing is highlighted, start from selected item (if exists) or bottom
          if (prev < 0) {
            return selectedIndex >= 0 ? selectedIndex : filteredOptions.length - 1;
          }
          // Always move up from current highlighted index (works with mouse hover too)
          const prevIndex = prev - 1;
          return prevIndex >= 0 ? prevIndex : filteredOptions.length - 1; // Wrap to last
        });
        // Reset keyboard navigation flag after a short delay
        setTimeout(() => {
          isKeyboardNavigationRef.current = false;
        }, 100);
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Restore selected value label on escape
        if (selectedOption) {
          setInputValue(selectedOption.label);
        } else {
          setInputValue("");
        }
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectOption = (option: AutocompleteOption) => {
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    handleSelectOption(option);
  };

  const handleOptionMouseEnter = (index: number) => {
    // Only update highlight on mouse enter if not currently using keyboard navigation
    if (!isKeyboardNavigationRef.current) {
      setHighlightedIndex(index);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else {
      handleInputFocus();
    }
  };

  // Build end icon - show loading if loading, clear if value exists, otherwise arrow
  const endIcon = (
    <div className="autocomplete-end-icons">
      {loading ? (
        <span className="autocomplete-loading-icon">
          <LoadingIcon size={20} />
        </span>
      ) : value ? (
        <span className="autocomplete-clear-icon" onClick={handleClear} onMouseDown={(e) => e.preventDefault()}>
          <ClearIcon size={20} />
        </span>
      ) : (
        <span
          className={`autocomplete-chevron-icon ${isOpen ? "open" : ""}`}
          onClick={handleToggleDropdown}
          onMouseDown={(e) => e.preventDefault()}
        >
          <ChevronDownIcon size={20} />
        </span>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="autocomplete-container">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        rootClassName="autocomplete-input-wrapper"
        endIcon={endIcon}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="autocomplete-listbox"
        aria-activedescendant={highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined}
      />

      {isOpen && filteredOptions.length > 0 && (
        <ul ref={listRef} id="autocomplete-listbox" role="listbox" className="autocomplete-listbox">
          {filteredOptions.map((option, index) => {
            const isHighlighted = index === highlightedIndex;
            const isSelected = option.value === value;

            return (
              <li
                key={option.value}
                id={`autocomplete-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`autocomplete-option ${isHighlighted ? "highlighted" : ""} ${isSelected ? "selected" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur
                  handleOptionClick(option);
                }}
                onMouseEnter={() => handleOptionMouseEnter(index)}
              >
                {renderOption ? renderOption({ option, isHighlighted, isSelected }) : option.label}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <ul id="autocomplete-listbox" role="listbox" className="autocomplete-listbox autocomplete-empty">
          <li role="option" className="autocomplete-option autocomplete-no-results">
            No options found
          </li>
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
