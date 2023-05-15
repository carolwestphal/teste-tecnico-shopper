'use client'

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="file-form">
        <h3>Enviar arquivo para atualizar produtos</h3>

        <div className="form-group">
          <input type="file" />
        </div>

        <div className="form-group button-bar">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Verificar
          </button>

          <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Enviar
          </button>
        </div>
      </div>
    </main>
  )
}