import React, { useState } from 'react'; // ✨ Importação do useState é crucial

function BotaoSincronizar() {
  const [status, setStatus] = useState('idle'); // 'idle', 'syncing', 'success'
  
  const handleClick = () => {
    // 1. Impedir cliques se já estiver sincronizando
    if (status === 'syncing') return;

    setStatus('syncing');

    // 2. Simula a sincronização (2 segundos)
    setTimeout(() => {
      setStatus('success');
      
      // 3. Volta ao estado 'idle' (ocioso) após mostrar o sucesso (3 segundos)
      setTimeout(() => {
        setStatus('idle');
      }, 3000); 
      
    }, 2000);
  };
  
  const getButtonContent = () => {
    switch (status) {
      case 'syncing':
        return (
          <>
            <span className="spinner"></span> 
            Sincronizando...
          </>
        );
      case 'success':
        return (
          <>
            <span role="img" aria-label="Verificado">✅</span> 
            Sincronizado!
          </>
        );
      default:
        return (
          <>
            <span role="img" aria-label="Sincronizar">🔄</span> 
            Sincronizar Capibas
          </>
        );
    }
  };

  return (
    <button 
      // Aplicar classes CSS dinamicamente com base no 'status'
      className={`btn-sync ${status === 'syncing' ? 'syncing' : ''} ${status === 'success' ? 'success' : ''}`}
      onClick={handleClick}
      // Desabilitar o botão enquanto a sincronização está ativa
      disabled={status === 'syncing'}
    >
      {getButtonContent()}
    </button>
  );
}

export default BotaoSincronizar;