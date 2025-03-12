import styles from "./App.module.css";
import { DeviceList } from "./components/DeviceList";

function App() {
  return (
    <>
      <div className={styles.root}>
        <h1 className={styles.title}>Wake-on-Lan Console</h1>
        <DeviceList></DeviceList>
      </div>
    </>
  );
}

export default App;
