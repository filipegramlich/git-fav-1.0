import { GitHubUser } from "./GithubUser.js";
export class Favorites {
    constructor(root){

        this.root = document.querySelector(root);

        this.load();
        this.tbody = this.root.querySelector("table tbody");

    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    }
    save(){
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
    }
    async add(username){
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error("Usuário já cadastrado")
            }
            const user = await GitHubUser.search(username);
            
            if(user.login === undefined){
                throw new Error('Usuário não encontrado!');
            }
            this.entries = [user, ...this.entries]
            this.update();
            this.save();
        } catch(error){
            alert(error.message);
        }
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry =>entry.login !== user.login);
        this.entries = filteredEntries;
        this.update();
        this.save();
    }
}

export class FavoritesView extends Favorites{
    constructor (root){

        super(root);

        this.update();
        this.onAddButton();

    }

    createRow(){
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/ldantascruz.png" alt="Imagem do Lucas">
                <a href="https://github.com/ldantascruz" target="_blank">
                    <p>Lucas Cruz</p>
                    <span>ldantascruz</span>
                </a>
            </td>
            <td class="repositories">
                18
            </td>
            <td class="followers">
                40000
            </td>
            <td>
                <button class ="remove">&times;</button>
            </td> `

        return tr;
    }

    update(){
        this.removeAllRows();
        this.entries
            .forEach(user=>{
                const row = this.createRow();

                row.querySelector(".user img").src = `https://github.com/${user.login}.png`
                row.querySelector(".user p").textContent = user.name;
                row.querySelector(".user a").href = `https://github.com/${user.login}`;
                row.querySelector(".user span").textContent = user.login;
                row.querySelector(".repositories").textContent = user.public_repos;
                row.querySelector(".followers").textContent = user.followers;
                row.querySelector(".remove")
                    .onclick = ()=>{

                            const isOkay = confirm("Tem certeza que quer deletar?");
                            if(isOkay)
                            {
                                this.delete(user);   
                    }
                }
                this.tbody.append(row);
            }
        )
    }

    onAddButton(){
        const addButton = this.root.querySelector(".search button")
        addButton.onclick 
            =()=>{

            const {value} = this.root.querySelector(".search input")
            this.add(value);

        }
    }
    removeAllRows(){
            this.tbody.querySelectorAll("tr").forEach((tr)=>{
                tr.remove();
            }
        )
    }
}