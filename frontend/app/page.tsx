'use client'

import axios from "axios";
import { useState, useRef } from "react";

interface ValidationError {
  lineNumber: number;
  errors: string;
}

interface Product {
  code: number;
  name: string;
  cost_price: number;
  sales_price: number;
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, changeErrors] = useState([]);
  const [updates, changeUpdates] = useState([]);
  const [verifySuccess, changeVerifySuccess] = useState(false);

  function onFileInputChange() {
    changeErrors([]);
    changeUpdates([]);
    changeVerifySuccess(false);
  }

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

    if (response.data.length === 0) {
      changeVerifySuccess(true);
    }
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
    } else {
      changeUpdates(response.data);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="file-form">
        <h3>Enviar arquivo para atualizar produtos</h3>

        <div className="form-group">
          <input type="file" onChange={onFileInputChange} ref={fileInputRef} />
        </div>

        <div className="form-group button-bar">
          <button
            onClick={onVerifyFile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Validar
          </button>

          <button
            onClick={onSendFile}
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Atualizar
          </button>
        </div>

        {verifySuccess && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
            Nenhum erro encontrado no arquivo!
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="mt-4">
          Erros encontrados no arquivo:
          <table className="table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-8 text-left py-3 px-4 uppercase font-semibold text-sm">
                  Linha
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Erro
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {errors
                .sort((firstError: ValidationError, secondError: ValidationError) => firstError.lineNumber - secondError.lineNumber)
                .map((error: ValidationError, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-gray-100' : undefined}>
                    <td className="w-8 text-left py-3 px-4 uppercase font-semibold text-sm">
                      {error.lineNumber}
                    </td>
                    <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                      {error.errors}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {updates.length > 0 && (
        <div className="mt-4">
          Atualizações feitas:
          <table className="table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-8 text-left py-3 px-4 uppercase font-semibold text-sm">
                  Produto
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Nome
                </th>
                <th className="w-40 text-left py-3 px-4 uppercase font-semibold text-sm">
                  Preço de Custo
                </th>
                <th className="w-40 text-left py-3 px-4 uppercase font-semibold text-sm">
                  Preço de Venda
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {updates.map((update: Product, index) => (
                <tr key={index} className={index % 2 === 1 ? 'bg-gray-100' : undefined}>
                  <td className="w-8 text-left py-3 px-4 uppercase font-semibold text-sm">
                    {update.code}
                  </td>
                  <td className="text-left py-3 px-4 uppercase font-semibold text-sm">
                    {update.name}
                  </td>
                  <td className="w-40 text-left py-3 px-4 uppercase font-semibold text-sm">
                    {update.cost_price}
                  </td>
                  <td className="w-40 text-left py-3 px-4 uppercase font-semibold text-sm">
                    {update.sales_price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}