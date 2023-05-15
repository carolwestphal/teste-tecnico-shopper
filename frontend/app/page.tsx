'use client'

import axios from "axios";
import { useState, useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, changeErrors] = useState([]);

  async function onVerifyFile() {
    if (!fileInputRef.current?.files?.length) {
      return;
    }

    var formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    const response = await axios.post('http://localhost:8080/validate-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    changeErrors(response.data);
  }

  async function onSendFile() {
    if (!fileInputRef.current?.files?.length) {
      return;
    }

    var formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    const response = await axios.post('http://localhost:8080/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      validateStatus: () => true,
    });
    
    console.log(response);

    if (response.status !== 200) {
      changeErrors(response.data);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="file-form">
        <h3>Enviar arquivo para atualizar produtos</h3>

        <div className="form-group">
          <input type="file" ref={fileInputRef} />
        </div>

        <div className="form-group button-bar">
          <button
            onClick={onVerifyFile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Verificar
          </button>

          <button
            onClick={onSendFile}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Enviar
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div>
          {JSON.stringify(errors)}
        </div>
      )}
    </main>
  )
}