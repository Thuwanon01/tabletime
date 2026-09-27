// หน้าแรกชั่วคราว ขั้น 8 จะเปลี่ยนเป็นรายการร้านอาหาร
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-5 py-24">
      <h1 className="tabletime-text-h1 text-foreground">TableTime</h1>
      <p className="tabletime-text-body text-muted-foreground">
        จองโต๊ะร้านอาหารที่ชอบ เปิดร้านของคุณเอง และรีวิวร้านให้คนอื่นได้อ่าน
      </p>
    </main>
  );
}
