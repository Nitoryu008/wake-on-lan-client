import { IPublishPacket, MqttClient } from "mqtt";
import styles from "./Indicator.module.css";
import { useEffect, useState } from "react";

type Props = {
  client: MqttClient | null;
  name: string;
};

export const Indicator: React.FC<Props> = ({ client, name }: Props) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (client) {
      client.on(
        "message",
        (
          topic: string,
          message: Buffer<ArrayBufferLike>,
          packet: IPublishPacket
        ) => {
          console.log(
            `topic: ${topic}, message: ${message.toString()}, packet: ${packet.length}`
          );
          if (message.toString() == name) {
            if (topic == "active") {
              setIsActive(true);
            } else if (topic == "inactive") {
              setIsActive(false);
            }
          }
        }
      );
    }
  }, [client]);

  return (
    <>
      <span
        className={`${styles.indicator} ${isActive ? styles.active : styles.inactive}`}
      ></span>
      <p>{isActive ? "Active" : "Inactive"}</p>
    </>
  );
};
