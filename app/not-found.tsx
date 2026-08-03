import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.badge}>4 0 4</div>
        <h1 className={styles.title}>Esta ruta no existe</h1>
        <p className={styles.desc}>
          Parece que te perdiste fuera del ecosistema LEAD. Volvamos al inicio para
          que Auki te guíe.
        </p>
        <Link href="/" className={styles.link}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}