// Format number with separator
export const formatNumber = (number: number, separator: string = ' ') => {
    // Convert the number to a string
    const numberStr = number.toString();

    // Format the number with the specified separator
    const formattedNumber = numberStr.match(/.{1,4}/g)?.join(separator);

    return formattedNumber || number;

  };