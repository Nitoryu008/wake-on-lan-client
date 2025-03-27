import { MqttContext } from "./DeviceList";
import { Indicator } from "./Indicator";
import styles from "./DeviceItem.module.css";
import { IPublishPacket, MqttClient } from "mqtt";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  mqttPublish: (context: MqttContext) => void;
  client: MqttClient | null;
};

export const DeviceItem: React.FC<Props> = ({
  name,
  mqttPublish,
  client,
}: Props) => {
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
          const msg = message.toString();
          console.log(
            `topic: ${topic}, message: ${msg}, packet: ${packet.length}`
          );

          if (topic == `/${name}/state`) {
            if (msg == "active") {
              setIsActive(true);
            } else if (msg == "inactive") {
              setIsActive(false);
            } else {
              console.log(`Invalid status message: ${name}`);
            }
          }
        }
      );
    }
  }, [client]);

  return (
    <tr key={name}>
      <td className={styles.name}>{name}</td>
      <td className={styles.status}>
        <Indicator isActive={isActive}></Indicator>
      </td>
      <td>
        <button
          className={styles.button}
          onClick={() =>
            mqttPublish({
              topic: "/wakeup",
              qos: 1,
              payload: name,
            })
          }
        >
          Boot
        </button>
      </td>
    </tr>
  );
};
