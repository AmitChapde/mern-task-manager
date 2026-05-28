import styles from "./SearchBar.module.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <label className={styles.searchBar}>
      <span>Search</span>
      <input
        onChange={(event) => onChange(event.target.value)}
        placeholder="Find tasks"
        type="search"
        value={value}
      />
    </label>
  );
};

export default SearchBar;
