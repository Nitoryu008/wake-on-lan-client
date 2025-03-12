import mqtt, { IClientOptions, MqttClient } from "mqtt";
import { QoS } from "mqtt-packet";
import { useEffect, useState } from "react";
import styles from "./DeviceList.module.css";
import { Indicator } from "./Indicator";

const deviceNames = import.meta.env.VITE_DEVICE_NAMES?.split(",");

const mqttOptions = {
  keepalive: 60,
  clientId: "emqx_react_" + Math.random().toString(16).substring(2, 8),
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  connectTimeout: 30 * 1000,
  will: {
    topic: "will",
    payload: "Connection closed abnormally.",
    qos: 0,
    retain: false,
  },
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,
} as mqtt.IClientOptions;

export type Subscription = {
  topic: string | string[] | mqtt.ISubscriptionMap;
  qos: QoS;
};

export const DeviceList = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Connecting...");

  const mqttConnect = (options: IClientOptions) => {
    setClient(mqtt.connect(import.meta.env.VITE_MQTT_BROKER_URL, options));
    console.log("Client created");
  };

  const mqttPublish = (context: {
    topic: string;
    qos: QoS;
    payload: string | Buffer;
  }) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  const mqttSubscribe = (subscription: Subscription) => {
    if (client) {
      const { topic, qos } = subscription;

      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error: ", error);
          return;
        }
        console.log("Subscribed topic: ", topic);
      });
    }
  };

  useEffect(() => {
    mqttConnect(mqttOptions);
  }, []);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        setConnectStatus("Connected");
      });
      client.on("error", (error) => {
        console.error("Connection error: ", error);
        client.end();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting...");
      });

      mqttSubscribe({ topic: ["active", "inactive"], qos: 1 });
    }
  }, [client]);

  return (
    <>
      <p className={styles.log}>MQTT Status: {connectStatus}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>DEVICE</th>
            <th>STATUS</th>
            <th>BUTTON</th>
          </tr>
        </thead>
        <tbody>
          {deviceNames.map((name) => (
            <tr key={name}>
              <td className={styles.name}>{name}</td>
              <td className={styles.status}>
                <Indicator client={client} name={name}></Indicator>
              </td>
              <td>
                <button
                  className={styles.button}
                  onClick={() =>
                    mqttPublish({ topic: "wakeup", qos: 1, payload: name })
                  }
                >
                  Boot
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
