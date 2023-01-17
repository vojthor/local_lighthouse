// Count median
export const median = (numbers) => {
  const mid = Math.floor(numbers.length / 2),
    nums = [...numbers].sort((a, b) => a - b);

  return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
