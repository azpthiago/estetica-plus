# _Escopo_

Projeto simples de API para realização de testes de integração e performance utilizando JEST

# _Descrição dos testes_

## **Criação de novo agendamento - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir a integridade da criação de um novo agendamento através do seu respectivo módulo. |
| Técnica | -> O sistema deve invocar o método de criação de registro do módulo de agenda. |
| Critério de Finalização | -> O retorno da criação do novo agendamento deve conter o ID do mesmo e a mensagem de “Agendamento criado com sucesso.” |
| Considerações Especiais | Considerar o ID do registro trazido pelo log, pois devido à rotina de testes pode gerar um ID diferente de 1. |

</br>

## **Busca de agendamento por ID - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir a integridade dos dados inseridos no banco de dados buscando um registro por ID. |
| Técnica | -> O sistema deve invocar o método de busca de registro por ID presente no módulo de agenda |
| Critério de Finalização | -> Os dados devem ser validados e verificados um a um dentro da rotina de testes para que todos estejam validados com sucesso |
| Considerações Especiais | -> Devido à inconsistência com datas do JavaScript, deve-se parametrizar a data de uma String para uma IsoString pare que possa executar o teste.| 

</br>

## **Busca de agendamento por nome completo da pessoa - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir a integridade dos dados inseridos no banco de dados ao buscar um registro por nome da pessoa. |
| Técnica | -> O sistema deve invocar o método de criação de registro do módulo de agenda. </br> -> O sistema deve buscar o registro invocando o módulo de busca por nome presente no módulo de agenda |
| Critério de Finalização | -> O registro retornado pelo sistema deve conter o mesmo nome que foi inserido na chave _nome_pessoa_. |
| Considerações Especiais | Nenhum |

</br>

## **Busca invalida de agendamento por ID - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que o sistema não devolva dados incorretos ao buscar um registro que não existe pelo seu ID. |
| Técnica | -> O sistema deve invocar o método de busca de registro por ID presente no módulo de agenda. |
| Critério de Finalização | -> O retorno do método deve ser nulo. |
| Considerações Especiais | Nenhum |

</br>

## **Busca de agendamento por parte do nome da pessoa - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que a integridade da busca de registro por parte do nome inserido. |
| Técnica | -> O sistema deve inserir um registro no banco de dados utilizando o método de criação de registro presente no módulo de agenda.<br> -> O sistema deve buscar o registro invocando o módulo de busca por nome presente no módulo de agenda. |
| Critério de Finalização | -> O registro retornado pelo sistema deve conter o mesmo nome que foi inserido anteriormente. |
| Considerações Especiais | Nenhum |

</br>

## **Busca de todos os agendamentos por intervalo de datas - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que o sistema devolva todos os registros contidos no banco em um intervalo de datas enviado. |
| Técnica | -> O sistema deve invocar o método da classe agenda responsável pela inserção de dados para criar 3 novos registros com 2 datas contidas em um intervalo e uma fora <br> -> Após isto pela busca por datas e validar todos os registros contidos |
| Critério de Finalização | -> O sistema deve retornar somente 2  dos 3 registros inseridos. |
| Considerações Especiais | Nenhum |

</br>

## **Atualização de agendamento existente- Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que o sistema esteja atualizando registros presentes no banco de dados da maneira correta. |
| Técnica | -> O sistema deve invocar o método de criação de registro para criar um novo registro. <br> -> O sistema deve invocar o método da busca do registro por nome para trazer o registro criado e capturar o seu ID. <br> -> O sistema deve invocar o método de atualização de registro, atualizar um dos dados presentes e utilizar o ID capturado para realizar a atualização |
| Critério de Finalização | -> Deve-se retornar a mensagem ‘Agendamento atualizado com sucesso.’ <br> -> Deve validar todos os dados presentes no registro atualizado com os dados utilizados na atualização. |
| Considerações Especiais | Devido à inconsistência com datas do JavaScript, deve-se parametrizar a data de uma String para uma IsoString pare que possa executar o teste. |

</br>

## **Exclusão de agendamento existente- Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que o sistema esteja deletando/desativando registros presentes no banco de dados da maneira correta. |
| Técnica | -> O sistema deve invocar o método de criação de registro para criar um novo registro. <br> -> O sistema deve capturar o ID do novo agendamento através do retorno da criação. <br> -> O sistema deve invocar o método de exclusão de registro, atualizando o ID capturado para realizar a exclusão. |
| Critério de Finalização | -> O retorno deve ser nulo. |
| Considerações Especiais | Nenhum |

</br>

## **Busca de agendamento por ID executada em menos de 200ms - Jest**
| **Teste** | **Descrição** |
|-----------|---------------|
| Objetivo do Teste | Garantir que o sistema realize a busca de agendamento por ID em um intervalo de milissegundos pre-determinado. |
| Técnica | -> Iniciar o timer de desempenho <br> -> O sistema deve invocar o método de busca de registro por ID <br> -> Finalizar o timer de desempenho <br> -> Realizar o cálculo do tempo de execução da busca |
| Critério de Finalização | -> O tempo de execução da busca de registro deve ser menor que o tempo estipulado. |
| Considerações Especiais | Nenhum |



# _Padrão de variaveis de ambiente_

`DB_HOST` -> Variável para o HOST d o banco;

`DB_USER` -> Variável para o usuário do banco;

`DB_PASSWORD` -> Variável para a senha do banco;

`DB_SCHEMA` -> Variável para o nome do banco.
