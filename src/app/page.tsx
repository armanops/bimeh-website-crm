export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to BIM760
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your insurance products gateway
        </p>
        <a
          href="/products"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          Explore Products
        </a>
      </main>
    </div>
  );
}
