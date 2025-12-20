import { useState, useRef, useEffect, type ReactNode } from 'react'
import Input from './input'
import { ChevronDownIcon } from './icons'
import './autocomplete.scss'

export interface AutocompleteOption {
  value: string | number
  label: string
}

export interface RenderOptionProps {
  option: AutocompleteOption
  isHighlighted: boolean
  isSelected: boolean
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  value?: AutocompleteOption | null
  onChange?: (option: AutocompleteOption | null) => void
  onInputChange?: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  startIcon?: ReactNode
  disabled?: boolean
  loading?: boolean
  noOptionsText?: string
  filterOptions?: (options: AutocompleteOption[], inputValue: string) => AutocompleteOption[]
  renderOption?: (props: RenderOptionProps) => ReactNode
}

const defaultFilterOptions = (options: AutocompleteOption[], inputValue: string): AutocompleteOption[] => {
  const lowerInput = inputValue.toLowerCase()
  return options.filter(option => option.label.toLowerCase().includes(lowerInput))
}

const Autocomplete = ({
  options,
  value,
  onChange,
  onInputChange,
  label,
  placeholder,
  required,
  startIcon,
  disabled,
  loading,
  noOptionsText = 'No options',
  filterOptions = defaultFilterOptions,
  renderOption,
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Display value: when open show search query, when closed show selected label
  const displayValue = isOpen ? searchValue : (value?.label ?? '')

  const filteredOptions = filterOptions(options, searchValue)

  const getSelectedIndex = () => {
    if (!value) return -1
    return filteredOptions.findIndex(option => option.value === value.value)
  }

  const openDropdown = () => {
    setSearchValue('')
    setIsOpen(true)
    // Get selected index from full options list since search is empty
    const selectedIdx = value ? options.findIndex(opt => opt.value === value.value) : -1
    setHighlightedIndex(selectedIdx)
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setSearchValue('')
  }

  const handleFocus = () => {
    openDropdown()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen])

  const handleInputChange = (newValue: string | number) => {
    const strValue = String(newValue)
    setSearchValue(strValue)
    onInputChange?.(strValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleOptionClick = (option: AutocompleteOption) => {
    onChange?.(option)
    closeDropdown()
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        openDropdown()
        return
      }
    }

    const selectedIndex = getSelectedIndex()

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => {
          // If nothing highlighted, start from selected item or beginning
          if (prev < 0) return selectedIndex >= 0 ? selectedIndex : 0
          return prev < filteredOptions.length - 1 ? prev + 1 : 0
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => {
          // If nothing highlighted, start from selected item or end
          if (prev < 0) return selectedIndex >= 0 ? selectedIndex : filteredOptions.length - 1
          return prev > 0 ? prev - 1 : filteredOptions.length - 1
        })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex])
        } else if (selectedIndex >= 0) {
          // If nothing highlighted but there's a selected item, select it
          handleOptionClick(filteredOptions[selectedIndex])
        }
        break
      case 'Escape':
        closeDropdown()
        inputRef.current?.blur()
        break
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
    setSearchValue('')
    inputRef.current?.focus()
  }

  const endIcon = (
    <span className="autocomplete-toggle" onClick={() => !disabled && (isOpen ? closeDropdown() : openDropdown())}>
      {value ? (
        <span className="autocomplete-clear" onClick={handleClear}>
          ×
        </span>
      ) : (
        <ChevronDownIcon />
      )}
    </span>
  )

  return (
    <div className="autocomplete-root" ref={wrapperRef}>
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        label={label}
        placeholder={placeholder}
        required={required}
        startIcon={startIcon}
        endIcon={endIcon}
      />

      {isOpen && (
        <ul ref={listRef} className="autocomplete-dropdown">
          {loading ? (
            <li className="autocomplete-option autocomplete-loading">Loading...</li>
          ) : filteredOptions.length === 0 ? (
            <li className="autocomplete-option autocomplete-no-options">{noOptionsText}</li>
          ) : (
            filteredOptions.map((option, index) => {
              const isHighlighted = highlightedIndex === index
              const isSelected = value?.value === option.value

              return (
                <div onClick={() => handleOptionClick(option)} onMouseEnter={() => setHighlightedIndex(index)}>
                  {renderOption ? (
                    renderOption({ option, isHighlighted, isSelected })
                  ) : (
                    <li
                      key={option.value}
                      className={`autocomplete-option ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
                    >
                      {option.label}
                    </li>
                  )}
                </div>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
