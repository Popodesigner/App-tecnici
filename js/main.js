document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Gestisci il caricamento iniziale basato sull'hash URL
    const hash = window.location.hash.slice(1);
    if (hash) {
        app.navigateTo(hash);
    }
});

class App {
    constructor() {
        this.currentPage = 'home';
        this.pageHistory = ['home'];
        this.scanner = new Scanner();
        this.chatBot = new ChatBot();
        this.productManager = new ProductManager();
        
        // Database dei prodotti ricercabili
        this.searchableProducts = [
            // CALDAIE
            {
                category: 'caldaie',
                title: 'Caldaia Baxi Luna Duo-Tec+',
                description: 'Caldaia a condensazione ad alto rendimento',
                icon: 'fa-fire',
                keywords: ['caldaia', 'baxi', 'luna', 'duo-tec', 'condensazione', 'riscaldamento']
            },
            {
                category: 'caldaie',
                title: 'Caldaia Vaillant ecoTEC plus',
                description: 'Caldaia murale a condensazione',
                icon: 'fa-fire',
                keywords: ['caldaia', 'vaillant', 'ecotec', 'condensazione', 'riscaldamento']
            },
            {
                category: 'caldaie',
                title: 'Caldaia Immergas Victrix Plus',
                description: 'Caldaia a condensazione con produzione ACS istantanea',
                icon: 'fa-fire',
                keywords: ['caldaia', 'immergas', 'victrix', 'condensazione', 'acqua calda sanitaria']
            },
            {
                category: 'caldaie',
                title: 'Caldaia Beretta Exclusive Green',
                description: 'Caldaia murale a condensazione con scambiatore primario in alluminio',
                icon: 'fa-fire',
                keywords: ['caldaia', 'beretta', 'exclusive', 'green', 'condensazione']
            },

            // POMPE DI CALORE
            {
                category: 'pdc',
                title: 'Daikin Altherma 3',
                description: 'Pompa di calore aria-acqua',
                icon: 'fa-wind',
                keywords: ['pompa di calore', 'daikin', 'altherma', 'aria-acqua', 'climatizzazione']
            },
            {
                category: 'pdc',
                title: 'Mitsubishi Ecodan',
                description: 'Sistema idronica per riscaldamento e raffrescamento',
                icon: 'fa-wind',
                keywords: ['pompa di calore', 'mitsubishi', 'ecodan', 'idronica']
            },
            {
                category: 'pdc',
                title: 'Samsung EHS Split',
                description: 'Sistema a pompa di calore split per riscaldamento e raffrescamento',
                icon: 'fa-wind',
                keywords: ['pompa di calore', 'samsung', 'ehs', 'split', 'climatizzazione']
            },
            {
                category: 'pdc',
                title: 'LG Therma V',
                description: 'Pompa di calore aria-acqua ad alta efficienza',
                icon: 'fa-wind',
                keywords: ['pompa di calore', 'lg', 'therma v', 'aria-acqua']
            },

            // SOLARE
            {
                category: 'solare',
                title: 'Pannello Viessmann Vitosol 200-FM',
                description: 'Pannello solare termico piano',
                icon: 'fa-sun',
                keywords: ['solare', 'viessmann', 'vitosol', 'termico', 'pannello']
            },
            {
                category: 'solare',
                title: 'Pannello Paradigma AquaSystem',
                description: 'Sistema solare termico sottovuoto',
                icon: 'fa-sun',
                keywords: ['solare', 'paradigma', 'aquasystem', 'sottovuoto']
            },
            {
                category: 'solare',
                title: 'Pannello Vaillant auroTHERM',
                description: 'Collettore solare piano ad alto rendimento',
                icon: 'fa-sun',
                keywords: ['solare', 'vaillant', 'aurotherm', 'collettore']
            },

            // ACQUA
            {
                category: 'acqua',
                title: 'Scaldabagno Ariston Velis Evo',
                description: 'Scaldabagno elettrico ad accumulo',
                icon: 'fa-tint',
                keywords: ['scaldabagno', 'ariston', 'velis', 'elettrico', 'accumulo']
            },
            {
                category: 'acqua',
                title: 'Addolcitore BWT AQA perla',
                description: 'Sistema di addolcimento acqua domestico',
                icon: 'fa-tint',
                keywords: ['addolcitore', 'bwt', 'aqa', 'perla', 'trattamento acqua']
            },
            {
                category: 'acqua',
                title: 'Osmosi Inversa Culligan AC',
                description: 'Sistema di purificazione acqua ad osmosi inversa',
                icon: 'fa-tint',
                keywords: ['osmosi', 'culligan', 'ac', 'purificazione', 'acqua']
            },

            // POMPE
            {
                category: 'pompe',
                title: 'Grundfos ALPHA2',
                description: 'Circolatore ad alta efficienza',
                icon: 'fa-pump-soap',
                keywords: ['pompa', 'grundfos', 'alpha', 'circolatore']
            },
            {
                category: 'pompe',
                title: 'Wilo Stratos PICO',
                description: 'Pompa di circolazione intelligente',
                icon: 'fa-pump-soap',
                keywords: ['pompa', 'wilo', 'stratos', 'circolatore']
            },
            {
                category: 'pompe',
                title: 'DAB Evoplus',
                description: 'Circolatore elettronico a rotore bagnato',
                icon: 'fa-pump-soap',
                keywords: ['pompa', 'dab', 'evoplus', 'circolatore', 'elettronica']
            },
            {
                category: 'pompe',
                title: 'Lowara ecocirc XL',
                description: 'Circolatore per impianti di riscaldamento e condizionamento',
                icon: 'fa-pump-soap',
                keywords: ['pompa', 'lowara', 'ecocirc', 'circolatore']
            },

            // CENTRALINE
            {
                category: 'centraline',
                title: 'Siemens RVS',
                description: 'Centralina di regolazione per impianti di riscaldamento',
                icon: 'fa-microchip',
                keywords: ['centralina', 'siemens', 'rvs', 'regolazione']
            },
            {
                category: 'centraline',
                title: 'Honeywell Smile',
                description: 'Regolatore climatico per sistemi di riscaldamento',
                icon: 'fa-microchip',
                keywords: ['centralina', 'honeywell', 'smile', 'regolazione', 'climatica']
            },
            {
                category: 'centraline',
                title: 'Coster XCC',
                description: 'Centralina di termoregolazione modulare',
                icon: 'fa-microchip',
                keywords: ['centralina', 'coster', 'xcc', 'termoregolazione']
            },

            // ELETTRICI
            {
                category: 'elettrici',
                title: 'ABB Tmax XT',
                description: 'Interruttore automatico scatolato',
                icon: 'fa-bolt',
                keywords: ['interruttore', 'abb', 'tmax', 'elettrico']
            },
            {
                category: 'elettrici',
                title: 'Schneider Acti9',
                description: 'Sistema modulare di protezione elettrica',
                icon: 'fa-bolt',
                keywords: ['interruttore', 'schneider', 'acti9', 'protezione']
            },
            {
                category: 'elettrici',
                title: 'Gewiss Serie 90',
                description: 'Quadri elettrici di distribuzione',
                icon: 'fa-bolt',
                keywords: ['quadro', 'gewiss', 'serie 90', 'distribuzione']
            },
            {
                category: 'elettrici',
                title: 'Bticino Livinglight',
                description: 'Serie civile per impianti elettrici',
                icon: 'fa-bolt',
                keywords: ['serie civile', 'bticino', 'livinglight', 'elettrico']
            }
        ];
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateTo(btn.dataset.page);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goBack();
            });
        });

        // Scanner
        document.getElementById('scannerBtn').addEventListener('click', () => {
            this.navigateTo('scanner');
            this.scanner.initialize();
        });

        // Products
        document.getElementById('productsBtn').addEventListener('click', () => {
            this.navigateTo('products');
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadProductSelection(btn.dataset.category);
            });
        });

        // Gestione del pulsante "indietro" del browser
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, true);
            }
        });

        // Aggiungi gestore per il tasto Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.goBack();
            }
        });

        // Gestione dei collegamenti rapidi
        document.querySelectorAll('.quick-link-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                if (category) {
                    // Naviga alla pagina prodotti
                    document.querySelectorAll('.page').forEach(page => {
                        page.classList.add('hidden');
                    });
                    
                    // Mostra la pagina prodotti
                    const productsPage = document.getElementById('productsPage');
                    productsPage.classList.remove('hidden');
                    
                    // Simula il click sulla categoria corrispondente
                    const categoryBtn = productsPage.querySelector(`[data-category="${category}"]`);
                    if (categoryBtn) {
                        categoryBtn.click();
                    }
                    
                    // Aggiorna il pulsante attivo nella barra di navigazione
                    document.querySelectorAll('.nav-btn').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.dataset.page === 'products') {
                            btn.classList.add('active');
                        }
                    });
                }
            });
        });

        // Gestione della ricerca globale
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.querySelector('.search-results');
        const resultsList = document.querySelector('.results-list');
        const recentSearches = document.querySelector('.recent-searches');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length > 0) {
                recentSearches.classList.add('hidden');
                
                const filteredResults = this.searchableProducts.filter(product => {
                    return product.title.toLowerCase().includes(searchTerm) ||
                           product.description.toLowerCase().includes(searchTerm) ||
                           product.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
                });

                this.updateSearchResults(filteredResults);
                searchResults.classList.remove('hidden');
            } else {
                recentSearches.classList.remove('hidden');
                searchResults.classList.add('hidden');
            }
        });

        // Gestione click sui risultati
        resultsList.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.result-item');
            if (resultItem) {
                const category = resultItem.dataset.category;
                if (category) {
                    this.navigateTo('products');
                    const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
                    if (categoryBtn) {
                        categoryBtn.click();
                    }
                }
            }
        });

        // Aggiorna i contatori dei filtri
        this.updateFilterCounts();
    }

    navigateTo(page, isPopState = false) {
        const previousPage = this.currentPage;
        
        // Nascondi tutte le pagine
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        
        // Mostra la pagina richiesta
        const pageElement = document.getElementById(`${page}Page`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
            
            // Aggiorna la cronologia solo se non è un evento popstate
            if (!isPopState) {
                // Aggiungi alla cronologia del browser
                window.history.pushState({ page }, '', `#${page}`);
                
                // Aggiorna la cronologia interna
                this.pageHistory.push(page);
            }

            // Gestisci le azioni specifiche per pagina
            if (page === 'scanner') {
                this.scanner.initialize();
            } else {
                this.scanner.stop();
            }

            // Aggiorna i pulsanti di navigazione
            this.updateNavigation(page);
        }

        this.currentPage = page;
    }

    goBack() {
        if (this.pageHistory.length > 1) {
            // Rimuovi la pagina corrente dalla cronologia
            this.pageHistory.pop();
            
            // Prendi l'ultima pagina della cronologia
            const previousPage = this.pageHistory[this.pageHistory.length - 1];
            
            // Torna indietro nella cronologia del browser
            window.history.back();
            
            // Aggiorna l'interfaccia
            this.navigateTo(previousPage, true);
        }
    }

    updateNavigation(currentPage) {
        // Aggiorna i pulsanti di navigazione
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === currentPage);
        });

        // Mostra/nascondi il pulsante indietro
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.style.display = this.pageHistory.length > 1 ? 'block' : 'none';
        });
    }

    loadProductSelection(category) {
        this.productManager.loadBrandsForCategory(category);
        this.navigateTo('productSelection');
        
        document.getElementById('confirmProduct').onclick = () => {
            const brand = document.getElementById('brandSelect').value;
            const model = document.getElementById('modelSelect').value;
            
            if (brand && model) {
                this.startChat(brand, model);
            } else {
                alert('Seleziona marca e modello');
            }
        };
    }

    startChat(brand, model) {
        this.chatBot.setContext(brand, model);
        this.navigateTo('chat');
    }

    updateFilterCounts() {
        const totalCount = this.searchableProducts.length;
        document.querySelector('[data-filter="all"] .count').textContent = `(${totalCount})`;
        document.querySelector('[data-filter="products"] .count').textContent = `(${totalCount})`;
    }

    updateSearchResults(results) {
        const resultsList = document.querySelector('.results-list');
        const resultsCount = document.querySelector('.results-count');
        
        if (results.length > 0) {
            resultsList.innerHTML = results.map(product => `
                <div class="result-item" data-category="${product.category}">
                    <div class="result-icon">
                        <i class="fas ${product.icon}"></i>
                    </div>
                    <div class="result-content">
                        <h4 class="result-title">${product.title}</h4>
                        <p class="result-description">${product.description}</p>
                        <div class="result-meta">
                            <span class="result-category">Prodotti</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            resultsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Nessun risultato trovato</p>
                </div>
            `;
        }
        
        resultsCount.textContent = `${results.length} risultat${results.length === 1 ? 'o' : 'i'}`;
    }
}

// Funzioni helper per le sezioni non ancora implementate
function showErrorsSection() {
    // Per ora reindirizza alla pagina prodotti con un filtro per gli errori
    document.getElementById('productsPage').classList.remove('hidden');
    // Qui puoi aggiungere logica per filtrare e mostrare solo gli errori
}

function showManualsSection() {
    // Per ora reindirizza alla pagina prodotti con un filtro per i manuali
    document.getElementById('productsPage').classList.remove('hidden');
    // Qui puoi aggiungere logica per filtrare e mostrare solo i manuali
} 