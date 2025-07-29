import TetrisGame from '@/components/games/tetris'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export default function TetrisPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <TetrisGame />
      </main>
      <Footer />
    </div>
  )
}
