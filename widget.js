 /**
         * @author GILVAN MOURA
         * @github MOURAGILVAN
         * @version 1.0.0
         * @description O SCRIPT VISA GERAR UMA INTERFACE DE CONSUMO DA API PARALLELUM
         *              A URL DA API PODE SER ACESSADA NO ENDEREÇO ELETRÔNICO https://deividfortuna.github.io/fipe/
         */

        /**
         * INÍCIO DA MONTAGEM DOS ITENS DO FORMULÁRIO 
         */
        var containerFIPE = document.getElementById("main-pesquisa-fipe");

        //CRIA A DIV QUE VAI RECEBER OS ELEMENTOS DO FORMULÁRIO
        var comboOptionsMain = document.createElement("div");
        comboOptionsMain.id = "combo_options_csrf";

        //MONTA O HTML DO CONTEÚDO: DIVS, INPUTS E ETC.
        var htmlComboOptions = `<style>
                                    .fipe_select_csrf {
                                        border: 1px solid gray;
                                        background: white;
                                        font-size: smaller;
                                        margin-bottom: 3px;
                                        width: 100%;
                                    }

                                    .btn_fipe_csrf {
                                        background: white;
                                        border: 1px solid gray;
                                        padding: 10px;
                                        cursor: pointer;
                                        text-transform: uppercase;
                                    }
                                </style>
                                <div>                                                                         
                                <select id="marcas" class="fipe_select_csrf">
                                    <option style="position: absolute">
                                       Selectione uma marca ::
                                    </option> 
                                </select> 
                                <br>
                                <select id="modelos" class="fipe_select_csrf">
                                    <option>Selecione um modelo ::</option>
                                </select>
                                <br>
                                <select id="anos" class="fipe_select_csrf">
                                    <option>Selecione um ano ::</option>
                                </select>
                                <br>
                                <button id="pesquisar-preco" class="btn_fipe_csrf">pesquisar</button>
                                </div>
                                <div id="loadingRespostaFIPE" style="display:none">
                                   <img style="width:520px" src="https://cdn.dribbble.com/users/2973561/screenshots/5757826/loading__.gif"/>
                                </div>
                                <div id="resultadoPesquisaPreco" style="display: none;">
                                    <p>Valor: <span id="labelValor" style="font-weight: bold;"></span></p>
                                    <p>Ano: <span id="labelAno"></span></p>
                                    <p>Código FIPE: <span id="labelCodigo"></span></p>
                                    <p>Combustível: <span id="labelCombustivel"></span></p>
                                    <p>Marca: <span id="labelMarca"></span></p>
                                    <p>Mês referência: <span id="labelMes"></span></p>
                                    <p>Modelo: <span id="labelModelo"></span></p>
                                </div>
                                `;

        //ATRIBUI O HTML AO ELEMENTO                        
        comboOptionsMain.innerHTML = htmlComboOptions;

        //COLOCA O HTML DENTRO DA DIV PRINCIPAL
        containerFIPE.appendChild(comboOptionsMain);

        /**
         * FIM DA MONTAGEM DOS ITENS DO FORMULÁRIO
         */


        //CAPTURA O ELEMENTO DO SELECT PELO ID  
        var selectMarcas = document.getElementById("marcas");

        //PEGA OS INPUTS DE SELECT PELO ID
        var selectAnos = document.getElementById("anos"); //ANO
        var selectModelos = document.getElementById("modelos"); //MODELO
        var botaoPesquisar = document.getElementById("pesquisar-preco"); //BOTÃO DE PESQUISAR PREÇO
        var searchInput = document.getElementById("searchInput");
        var ulMarcas = document.getElementById("listaMarcas");

        //VARIÁVEIS PARA TRATAMENTO DINÂMICO DOS CÓDIGOS DE MARCA E MODELO
        var codigoMarca = null;
        var codigoModelo = null;


        //URLs DA API 
        //URL BASE
        var url_base_fipe = "https://parallelum.com.br/fipe/api/v1";

        //URL DO ENDPOINT DE MARCAS
        var url_marcas = url_base_fipe + "/carros/marcas";

        //CONSOME A API PARA RETORNAR AS MARCAS
        fetch(url_marcas).then(response => response.json()).then(marcas => {

            listaMarcas = marcas;

            //FAZ UM LOOP NO RETORNO DAS MARCAS E ADICIONA O OPTION NO SELECT DE MARCAS           
            marcas.forEach(item => {
                var option = document.createElement("option");
                option.value = item.codigo;
                option.text = item.nome;
                selectMarcas.add(option);
            });


        });



        //EVENTO DO ONCHANGE DO COMBO BOX DE MARCAS
        selectMarcas.addEventListener('change', function(event) {

            //ATRIBUI O VALOR DO CAMPO SELECIONADO DO COMBO NA VARIÁVEL
            codigoMarca = event.target.value;

            var url_modelos = url_base_fipe + `/carros/marcas/${event.target.value}/modelos`;

            //LIMPA OS INPUTS DE MODELOS
            var modelos = document.querySelectorAll('#modelos option');
            modelos.forEach(o => o.remove());

            //LIMPA OS INPUTS DE ANOS
            var anos = document.querySelectorAll('#anos option');
            anos.forEach(o => o.remove());


            //SETA A OPTION INICIAL PARA MODELOS
            var opInicial1 = document.createElement("option");
            opInicial1.value = "";
            opInicial1.text = "Selecione um modelo";
            selectModelos.add(opInicial1);

            //SETA A OPTION INICIAL PARA ANOS
            var opInicial2 = document.createElement("option");
            opInicial2.value = "";
            opInicial2.text = "Selecione um ano";
            selectAnos.add(opInicial2);

            //CONSOME A API PARA OBTER A LISTA DE MODELOS PARA POPULAR O SELECT DE MODELOS
            fetch(url_modelos).then(response => response.json()).then(json => {

                // var comboInput = document.createElement("input");
                // comboInput.type = "search";

                // document.getElementById("combo_inputs_csrf").add(comboInput);

                //ATRIBUI O RETORNO NA VARIÁVEL MODELOS
                var modelos = json.modelos;

                //PERCORRE OS MODELOS RETORNADOS PELA API E POPULA OS OPTIONS
                modelos.forEach(item => {
                    var option = document.createElement("option");
                    option.value = item.codigo;
                    option.text = item.nome;
                    selectModelos.add(option);
                });

            });

        });



        //EVENTO DE ONCHANGE DO COMBO BOX DE MODELOS
        //AO SELECIONAR UM ITEM DA LISTA DISPARA A AÇÃO
        selectModelos.addEventListener('change', function(event) {

            //ATRIBUI O VALOR SELECIONADO DO COMBO BOX NA VARIÁVEL CODIGOMODELO
            //CONFORME DESCRITO ACIMA, ELA É UMA VARIÁVEL PARA LIDAR COM DADOS DINÂMICOS
            //OU SEJA O SEU VALOR É ALTERADO DE ACORDO COM A OPÇÃO SELECIONADA
            codigoModelo = event.target.value;

            //LIMPA A COMBO BOX DE ANOS
            var anos = document.querySelectorAll('#anos option');
            anos.forEach(o => o.remove());

            //SETA A OPTION INICIAL
            var opInicial2 = document.createElement("option");
            opInicial2.value = "";
            opInicial2.text = "Selecione um ano";
            selectAnos.add(opInicial2);

            //DECLARA A VARIÁVEL QUE CONTÉM O ENDPOINT PARA CONSULTAR OS ANOS DE ACORDO COM O MODELO SELECIONADO
            var url_modelos_anos = url_base_fipe + `/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`;

            //CONSOME A API PARA RETORNAR OS ANOS DO MODELO DE VEÍCULO SELECIONADO
            fetch(url_modelos_anos).then(response => response.json()).then(json => {

                //PERCORRE O RETORNO DA API E ADICIONA A OPTION
                json.forEach(item => {
                    var option = document.createElement("option");
                    option.value = item.codigo;
                    option.text = item.nome;
                    selectAnos.add(option);
                });

            });

        });

        //EVENTO DO CLICK DO BOTÃO DE PESQUISA
        //AO CLICAR NO BOTÃO É DISPARADA UMA AÇÃO OU FUNÇÃO
        botaoPesquisar.addEventListener('click', function(event) {

            //DECLARAÇÃO DA VARIÁVEL QUE RECEBE O VALOR DO ITEM SELECIONADO DO COMBO BOX DE ANOS
            var anoVeiculo = selectAnos.value;

            //CASO NÃO SEJA INFORMADO UM ANO
            if (!anoVeiculo) {
                alert('Informe o ano!');
                return;
            }

            //CASO NÃO SEJA INFORMADO UM MODELO
            var modeloVeiculo = selectModelos.value;
            if (!modeloVeiculo) {
                alert('Informe o modelo!');
                return;
            }

            //MOSTRA A IMAGEM DE LOADING
            document.getElementById("loadingRespostaFIPE").style.display = 'block';

            //DECLARAÇÃO DA VARIÁVEL DA URL DO ENDPOINT PARA CONSUMIR A API DE PESQUISA DE PREÇO
            var urlPesquisa = url_base_fipe + `/carros/marcas/${codigoMarca}/modelos/${modeloVeiculo}/anos/${anoVeiculo}`;

            //CONSOME O ENDPOINT DE PESQUISA DE PREÇO
            fetch(urlPesquisa).then(response => response.json()).then(json => {

                //MOSTRA A DIV QUE CONTÉM O HTML QUE RECEBERÁ O RESULTADO DA PESQUISA
                document.getElementById("resultadoPesquisaPreco").style.display = 'block';

                //SETA OS VALORES DE CADA ITEM DA COTAÇÃO DO BEM
                document.getElementById("labelAno").innerHTML = json.AnoModelo;
                document.getElementById("labelCodigo").innerHTML = json.CodigoFipe;
                document.getElementById("labelCombustivel").innerHTML = json.Combustivel;
                document.getElementById("labelMarca").innerHTML = json.Marca;
                document.getElementById("labelMes").innerHTML = json.MesReferencia;
                document.getElementById("labelModelo").innerHTML = json.Modelo;
                document.getElementById("labelValor").innerHTML = json.Valor;

            }).catch(error => { //CASO OCORRA UM ERRO GERA UM CONSOLE LOG PARA IMPRIMIR O ERRO

                //IMPRIME O ERRRO NO CONSOLE
                console.log(error);

            }).finally(() => { //INDEPENDENTE DO RESULTADO DA API, EXECUTA A AÇÃO OU FUNÇÃO

                //ESCONDE A IMAGEM DE LOADING
                document.getElementById("loadingRespostaFIPE").style.display = 'none';

            });

        });
