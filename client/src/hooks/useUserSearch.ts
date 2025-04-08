import { ChangeEvent, useState } from 'react';

/**
 * Custom hook for managing the state and logic of a header search input.
 * It tracks the value of the input and triggers a user filter update on change.
 *
 * @param setUserFilter - function to update the user filter based on the input value.
 * @returns - Contains the current input value, update function, and input change handler.
 * @returns val - The current value of the input field.
 * @returns setVal - Function to set the value of the input.
 * @returns handleInputChange - Function to update the input value and trigger the user filter.
 */
const useUserSearch = (setUserFilter: (search: string) => void) => {
  const [val, setVal] = useState<string>('');

  /**
   * Function to handle changes in the input field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    setUserFilter(e.target.value);
  };

  return {
    val,
    setVal,
    handleInputChange,
  };
};

export default useUserSearch;
