import React, { useState, useEffect } from 'react';
import CapibaraIcon from '../../assets/icon.png';
import StartButton from '../../components/StartButton/Start'
import CardDesafio from '../../components/CardsDesafio/CardDesafio';
import { getUserBalance } from '../../../services/api/BalanceApiClient';

function Home(){
    const [saldo, setSaldo] = useState(0);
    // Vamos usar o loading apenas para a PRIMEIRA vez que a tela abre
    const [isFirstLoading, setIsFirstLoading] = useState(true); 

    useEffect(() => {
        // Função que busca o saldo
        const buscarSaldo = async () => {
            try {
                // Nota: Se você quiser ver mudando, altere o valor no seu BalanceApiClient manualmente ou no banco
                const novoSaldo = await getUserBalance();
                setSaldo(novoSaldo);
            } catch (error) {
                console.error("Erro ao atualizar saldo:", error);
            } finally {
                // Desliga o loading inicial após a primeira tentativa
                setIsFirstLoading(false);
            }
        };

        // 1. Chama imediatamente ao abrir a tela
        buscarSaldo();

        // 2. Configura um "relógio" para chamar a cada 5 segundos (5000 ms)
        const intervalo = setInterval(() => {
            // Chama a busca novamente sem ativar o loading (atualização silenciosa)
            buscarSaldo(); 
        }, 50);

        // 3. LIMPEZA (Muito Importante): 
        // Quando o usuário sair dessa tela, paramos o relógio para não gastar memória
        return () => clearInterval(intervalo);

    }, []); // Array vazio garante que o intervalo seja criado apenas uma vez

    return(
    <div className="home-container">
        <div className="extrato-container">
            <h2 className="extrato-titulo">Extrato de Capibas</h2>

            <div className="total-acumulado-box">
                <div className="icone-capibara-wrapper">
                    <img 
                        src={CapibaraIcon}
                        alt="Ícone de Capibara" 
                        className="icone-capibara" 
                    />
                </div>
                
                <div className="texto-valor-wrapper">
                    <p className="texto-acumulado">Total Acumulado</p>
                    
                    {/* Só mostra "..." na primeira vez. Nas próximas, atualiza o número direto */}
                    <span className="valor-acumulado">
                        {isFirstLoading ? "..." : saldo}
                    </span>
                </div>
                
                <div className="icones-moeda-wrapper">
                    <span className="icone-moeda um" aria-hidden="true"></span>
                    <span className="icone-moeda dois" aria-hidden="true"></span>
                </div>
            </div>
        </div>
        <div className='StartButton'>
            <StartButton onClick={() => alert('Atividade Iniciada!')} />
        </div>
        <div className='CardsDesafios'></div>
    </div>
    );
}

export default Home;