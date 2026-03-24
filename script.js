document.addEventListener("DOMContentLoaded", () => {
    const siteData = window.SITE_DATA || {};
    const root = document.documentElement;
    const pageKind = document.body.dataset.pageKind || "";
    const pageSlug = document.body.dataset.pageSlug || "";
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const searchToggle = document.querySelector("[data-search-toggle]");
    const searchModal = document.querySelector("[data-search-modal]");
    const searchClose = document.querySelector("[data-search-close]");
    const searchInput = document.querySelector("[data-search-input]");
    const searchResults = document.querySelector("[data-search-results]");
    const searchStatus = document.querySelector("[data-search-status]");
    const siteNav = document.querySelector("[data-site-nav]");
    const navLinks = [...document.querySelectorAll(".nav-link")];
    let revealItems = [...document.querySelectorAll("[data-reveal]")];
    let yearTargets = [...document.querySelectorAll("[data-current-year]")];
    const themeKey = "portfolio-theme";
    const searchSources = buildSearchSources();
    let searchIndex = [];

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function buildSearchSources() {
        const sources = [
            { page: "Home", path: "/index.html" },
            { page: "Publications", path: "/blogs.html" },
            { page: "Projects", path: "/projects/" },
            { page: "Blogs", path: "/blogs/" },
            { page: "About", path: "/about.html" }
        ];

        if (Array.isArray(siteData.projects)) {
            siteData.projects.forEach((project) => {
                sources.push({
                    page: `Project · ${project.title}`,
                    path: `/projects/${project.slug}.html`
                });
            });
        }

        if (Array.isArray(siteData.blogs)) {
            siteData.blogs.forEach((blog) => {
                sources.push({
                    page: `Blog · ${blog.title}`,
                    path: `/blogs/${blog.slug}.html`
                });
            });
        }

        return sources;
    }

    function renderFooterMetadata() {
        const footerMeta = siteData.site;
        if (!footerMeta) {
            return;
        }

        document.querySelectorAll(".social-row").forEach((row) => {
            row.innerHTML = (footerMeta.socials || []).map((item) => `
                <a class="social-link" href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.ariaLabel)}">
                    <span class="social-icon" aria-hidden="true">${item.icon}</span>
                </a>
            `).join("");
        });

        document.querySelectorAll(".footer-meta p").forEach((node) => {
            node.innerHTML = `&copy; <span data-current-year></span> ${escapeHtml(footerMeta.name)} · ${escapeHtml(footerMeta.footerTagline)}`;
        });
    }

    function renderAboutMetadata() {
        if (pageKind !== "about" || !siteData.about) {
            return;
        }

        const profile = siteData.about.profile || {};
        const stack = siteData.about.stack || [];
        const facts = siteData.about.facts || [];

        const profileImage = document.querySelector("[data-about-profile-image]");
        if (profileImage) {
            profileImage.src = profile.image || profileImage.src;
            profileImage.alt = `Portrait of ${profile.name || siteData.site?.name || "Puneet Tomar"}`;
        }

        const profileName = document.querySelector("[data-about-profile-name]");
        if (profileName) {
            profileName.textContent = profile.name || siteData.site?.name || "";
        }

        const profileRole = document.querySelector("[data-about-profile-role]");
        if (profileRole) {
            profileRole.textContent = profile.role || "";
        }

        const stackLead = document.querySelector("[data-about-stack-lead]");
        if (stackLead) {
            stackLead.textContent = siteData.about.stackLead || "";
        }

        const stackGrid = document.querySelector("[data-about-stack-grid]");
        if (stackGrid) {
            stackGrid.innerHTML = stack.map((tool) => `
                <div class="tool-chip">
                    <span class="tool-icon" aria-hidden="true">
                        <img src="${escapeHtml(tool.icon)}" alt="">
                    </span>
                    <span>${escapeHtml(tool.label)}</span>
                </div>
            `).join("");
        }

        const factsContainer = document.querySelector("[data-about-facts]");
        if (factsContainer) {
            factsContainer.innerHTML = facts.map((fact) => `
                <div class="detail-item">
                    <strong>${escapeHtml(fact.label)}</strong>
                    <span>${escapeHtml(fact.value)}</span>
                </div>
            `).join("");
        }

        const linksContainer = document.querySelector("[data-about-profile-links]");
        if (linksContainer) {
            linksContainer.innerHTML = (profile.links || []).map((link) => `
                <div class="detail-item">
                    <strong>${escapeHtml(link.label)}</strong>
                    <span><a class="contact-link" href="${escapeHtml(link.href)}" ${link.href.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener noreferrer"'}>${escapeHtml(link.value)}</a></span>
                </div>
            `).join("");
        }
    }

    function renderBlogArchive() {
        if (pageKind !== "blog-archive" || !Array.isArray(siteData.blogs)) {
            return;
        }

        const featured = siteData.blogs[0];
        const list = document.querySelector("[data-blog-archive-list]");
        if (!featured || !list) {
            return;
        }

        const featuredMeta = document.querySelector("[data-blog-featured-meta]");
        const featuredTitle = document.querySelector("[data-blog-featured-title]");
        const featuredSummary = document.querySelector("[data-blog-featured-summary]");
        const featuredQuestion = document.querySelector("[data-blog-featured-question]");
        const featuredDomain = document.querySelector("[data-blog-featured-domain]");
        const featuredLink = document.querySelector("[data-blog-featured-link]");

        if (featuredMeta) featuredMeta.textContent = `${featured.date} · ${featured.type}`;
        if (featuredTitle) featuredTitle.textContent = featured.title;
        if (featuredSummary) featuredSummary.textContent = featured.summary;
        if (featuredQuestion) featuredQuestion.textContent = featured.question;
        if (featuredDomain) {
            featuredDomain.innerHTML = featured.domain.map((item) => `<span class="content-badge">${escapeHtml(item)}</span>`).join("");
        }
        if (featuredLink) {
            featuredLink.href = `./${featured.slug}.html`;
        }

        list.innerHTML = siteData.blogs.map((blog, index) => `
            <article class="blog-item blog-entry ${index === 0 ? "is-selected" : ""}" data-reveal data-blog-item data-blog-url="./${escapeHtml(blog.slug)}.html" data-blog-title="${escapeHtml(blog.title)}" data-blog-type="${escapeHtml(blog.type)}" data-blog-date="${escapeHtml(blog.date)}" data-blog-summary="${escapeHtml(blog.summary)}" data-blog-question="${escapeHtml(blog.question)}" data-blog-topics="${escapeHtml(blog.domain.join("|"))}" data-blog-methods="${escapeHtml(blog.methods.join("|"))}">
                <span class="blog-meta">${escapeHtml(blog.date)} · ${escapeHtml(blog.type)}</span>
                <h3>${escapeHtml(blog.title)}</h3>
                <p class="archive-question"><strong>Question</strong> ${escapeHtml(blog.question)}</p>
                <p>${escapeHtml(blog.archiveLead)}</p>
                <div class="tag-list">
                    ${blog.archiveTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
                <a class="blog-select" href="./${escapeHtml(blog.slug)}.html" data-blog-select>Read article</a>
            </article>
        `).join("");
    }

    function renderProjectArchive() {
        if (pageKind !== "project-archive" || !Array.isArray(siteData.projects)) {
            return;
        }

        const list = document.querySelector("[data-project-archive-list]");
        if (!list) {
            return;
        }

        list.innerHTML = siteData.projects.map((project) => `
            <article class="project-card" data-reveal>
                <div class="project-top">
                    <div>
                        <span class="project-meta">${escapeHtml(project.yearLabel)} · ${escapeHtml(project.type)} · ${escapeHtml(project.location)}</span>
                        <h3>${escapeHtml(project.title)}</h3>
                    </div>
                </div>
                <p>${escapeHtml(project.summary)}</p>
                <div class="tag-list">
                    ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
                <a class="project-link" href="./${escapeHtml(project.slug)}.html">View project</a>
            </article>
        `).join("");
    }

    function renderProjectDetail() {
        if (pageKind !== "project-detail" || !Array.isArray(siteData.projects)) {
            return;
        }

        const project = siteData.projects.find((item) => item.slug === pageSlug);
        if (!project) {
            return;
        }

        const eyebrow = document.querySelector("[data-project-detail-eyebrow]");
        const title = document.querySelector("[data-project-detail-title]");
        const summary = document.querySelector("[data-project-detail-summary]");
        const sections = document.querySelector("[data-project-detail-sections]");
        const details = document.querySelector("[data-project-detail-meta]");

        if (eyebrow) eyebrow.textContent = `${project.yearLabel} · ${project.type} · ${project.location}`;
        if (title) title.textContent = project.title;
        if (summary) summary.textContent = project.heroSummary;
        if (sections) {
            sections.innerHTML = project.sections.map((section) => `
                <h2>${escapeHtml(section.heading)}</h2>
                <p>${escapeHtml(section.body)}</p>
            `).join("");
        }
        if (details) {
            details.innerHTML = `
                <div class="detail-item"><strong>Type</strong><span>${escapeHtml(project.type)}</span></div>
                <div class="detail-item"><strong>Focus</strong><span>${escapeHtml(project.shortFocus)}</span></div>
                <div class="detail-item"><strong>Output</strong><span><a class="contact-link" href="${escapeHtml(project.output.href)}" ${project.output.href.startsWith("/") ? "" : 'target="_blank" rel="noopener noreferrer"'}>${escapeHtml(project.output.label)}</a></span></div>
            `;
        }
    }

    function renderBlogDetail() {
        if (pageKind !== "blog-detail" || !Array.isArray(siteData.blogs)) {
            return;
        }

        const blog = siteData.blogs.find((item) => item.slug === pageSlug);
        if (!blog) {
            return;
        }

        const meta = document.querySelector("[data-blog-detail-meta]");
        const title = document.querySelector("[data-blog-detail-title]");
        const subtitle = document.querySelector("[data-blog-detail-subtitle]");
        const byline = document.querySelector("[data-blog-detail-byline]");
        const details = document.querySelector("[data-blog-detail-meta-card]");

        if (meta) {
            meta.textContent = `${blog.date} · ${blog.type}`;
        }
        if (title) {
            title.textContent = blog.title;
        }
        if (subtitle) {
            subtitle.textContent = blog.subtitle;
        }
        if (byline) {
            byline.textContent = `Author: ${siteData.site?.shortName || "P. Tomar"}`;
        }
        if (details) {
            details.innerHTML = `
                <div class="detail-item"><strong>Domain</strong><span>${escapeHtml(blog.domain.join(", "))}</span></div>
                <div class="detail-item"><strong>Methods</strong><span>${escapeHtml(blog.methods.join(", "))}</span></div>
                <div class="detail-item"><strong>Keywords</strong><span>${escapeHtml(blog.keywords.join(", "))}</span></div>
            `;
        }
    }

    const themeIcons = {
        dark: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v2.25M12 18.75V21M4.22 4.22l1.6 1.6M18.18 18.18l1.6 1.6M3 12h2.25M18.75 12H21M4.22 19.78l1.6-1.6M18.18 5.82l1.6-1.6M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
        `,
        light: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8a8.5 8.5 0 1 0 11.3 11.3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
            </svg>
        `
    };

    const menuIcons = {
        open: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
        `,
        close: `
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
        `
    };

    const searchIcon = `
        <span class="search-toggle-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="m20 20-3.8-3.8M10.8 17a6.2 6.2 0 1 1 0-12.4a6.2 6.2 0 0 1 0 12.4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
            </svg>
        </span>
        <span class="search-toggle-copy">
            <span class="search-toggle-label">Search</span>
        </span>
    `;

    if (searchToggle) {
        searchToggle.innerHTML = searchIcon;
    }

    renderFooterMetadata();
    renderAboutMetadata();
    renderBlogArchive();
    renderProjectArchive();
    renderProjectDetail();
    renderBlogDetail();
    revealItems = [...document.querySelectorAll("[data-reveal]")];
    yearTargets = [...document.querySelectorAll("[data-current-year]")];

    const setTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        localStorage.setItem(themeKey, theme);

        if (themeToggle) {
            themeToggle.innerHTML = theme === "dark" ? themeIcons.dark : themeIcons.light;
            themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        }
    };

    const storedTheme = localStorage.getItem(themeKey);
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(storedTheme || preferredTheme);

    themeToggle?.addEventListener("click", () => {
        const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    });

    const closeMenu = () => {
        if (!siteNav || !menuToggle) {
            return;
        }

        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = menuIcons.open;
        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        if (!siteNav || !menuToggle) {
            return;
        }

        siteNav.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.innerHTML = menuIcons.close;
        document.body.classList.add("menu-open");
    };

    const closeSearch = () => {
        if (!searchModal) {
            return;
        }

        searchModal.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        searchToggle?.setAttribute("aria-expanded", "false");
    };

    const openSearch = async () => {
        if (!searchModal) {
            return;
        }

        closeMenu();
        searchModal.classList.add("is-open");
        document.body.classList.add("menu-open");
        searchToggle?.setAttribute("aria-expanded", "true");
        await buildSearchIndex();
        renderResults(searchInput?.value.trim() || "");
        searchInput?.focus();
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = siteNav?.classList.contains("is-open");
        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    });

    searchToggle?.addEventListener("click", () => {
        const isOpen = searchModal?.classList.contains("is-open");
        if (isOpen) {
            closeSearch();
            return;
        }

        openSearch();
    });

    searchClose?.addEventListener("click", closeSearch);
    searchModal?.addEventListener("click", (event) => {
        if (event.target === searchModal) {
            closeSearch();
        }
    });

    navLinks.forEach((link) => {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "/index.html");
        const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
        const isBlogArticle = /\/blogs\/(?!index\.html$)[^/]+\.html$/.test(currentPath);
        const isProjectArticle = /\/projects\/(?!index\.html$)[^/]+\.html$/.test(currentPath);
        const isBlogsNavLink = /\/blogs\/index\.html$/.test(linkPath) || /\/blogs\/$/.test(link.href);
        const isProjectsNavLink = /\/projects\/index\.html$/.test(linkPath) || /\/projects\/$/.test(link.href);

        if (linkPath === currentPath || (isBlogArticle && isBlogsNavLink) || (isProjectArticle && isProjectsNavLink)) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 780) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            closeSearch();
        }

        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openSearch();
        }
    });

    searchInput?.addEventListener("input", (event) => {
        renderResults(event.target.value.trim());
    });

    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.18 });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
            observer.observe(item);
        });
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    yearTargets.forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    const blogItems = [...document.querySelectorAll("[data-blog-item]")];
    const blogPanel = {
        featuredTitle: document.querySelector("[data-blog-featured-title]"),
        featuredSummary: document.querySelector("[data-blog-featured-summary]"),
        featuredQuestion: document.querySelector("[data-blog-featured-question]"),
        featuredMeta: document.querySelector("[data-blog-featured-meta]"),
        featuredDomain: document.querySelector("[data-blog-featured-domain]"),
        featuredLink: document.querySelector("[data-blog-featured-link]"),
        title: document.querySelector("[data-blog-panel-title]"),
        summary: document.querySelector("[data-blog-panel-summary]"),
        question: document.querySelector("[data-blog-panel-question]"),
        meta: document.querySelector("[data-blog-panel-meta]"),
        topics: document.querySelector("[data-blog-panel-topics]"),
        methods: document.querySelector("[data-blog-panel-methods]"),
        link: document.querySelector("[data-blog-panel-link]")
    };

    const createMetadataChips = (value) => {
        return value
            .split("|")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => `<span class="tag">${item}</span>`)
            .join("");
    };

    const selectBlogItem = (item) => {
        if (!item || !blogPanel.title) {
            return;
        }

        blogItems.forEach((entry) => entry.classList.toggle("is-selected", entry === item));
        if (blogPanel.featuredTitle) {
            blogPanel.featuredTitle.textContent = item.dataset.blogTitle || "";
        }
        if (blogPanel.featuredSummary) {
            blogPanel.featuredSummary.textContent = item.dataset.blogSummary || "";
        }
        if (blogPanel.featuredQuestion) {
            blogPanel.featuredQuestion.textContent = item.dataset.blogQuestion || "";
        }
        if (blogPanel.featuredMeta) {
            blogPanel.featuredMeta.textContent = `${item.dataset.blogDate || ""} · ${item.dataset.blogType || ""}`;
        }
        if (blogPanel.featuredDomain) {
            blogPanel.featuredDomain.innerHTML = createMetadataChips(item.dataset.blogTopics || "");
        }
        if (blogPanel.featuredLink) {
            blogPanel.featuredLink.setAttribute("href", item.dataset.blogUrl || "#");
        }
        blogPanel.title.textContent = item.dataset.blogTitle || "";
        blogPanel.summary.textContent = item.dataset.blogSummary || "";
        if (blogPanel.question) {
            blogPanel.question.textContent = item.dataset.blogQuestion || "";
        }
        if (blogPanel.meta) {
            blogPanel.meta.textContent = `${item.dataset.blogDate || ""} · ${item.dataset.blogType || ""}`;
        }
        blogPanel.topics.innerHTML = createMetadataChips(item.dataset.blogTopics || "");
        if (blogPanel.methods) {
            blogPanel.methods.innerHTML = createMetadataChips(item.dataset.blogMethods || "");
        }
        if (blogPanel.link) {
            blogPanel.link.setAttribute("href", item.dataset.blogUrl || "#");
        }
    };

    blogItems.forEach((item) => {
        item.addEventListener("click", () => selectBlogItem(item));
    });

    if (blogItems.length) {
        selectBlogItem(blogItems.find((item) => item.classList.contains("is-selected")) || blogItems[0]);
    }

    async function buildSearchIndex() {
        if (searchIndex.length) {
            return;
        }

        const parser = new DOMParser();
        const pages = await Promise.all(searchSources.map(async (source) => {
            try {
                const response = await fetch(source.path);
                const html = await response.text();
                const doc = parser.parseFromString(html, "text/html");
                const title = doc.querySelector("title")?.textContent?.trim() || source.page;
                const headings = [...doc.querySelectorAll("h1, h2, h3")].map((node) => node.textContent.trim()).filter(Boolean);
                const paragraphs = [...doc.querySelectorAll("p, li")].map((node) => node.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
                const summary = paragraphs.slice(0, 10).join(" ");
                const chunks = headings.map((heading, index) => ({
                    title: heading,
                    snippet: paragraphs[index] || summary.slice(0, 180),
                    body: `${heading} ${summary}`
                }));

                return chunks.length ? chunks.map((chunk) => ({ ...chunk, page: source.page, path: source.path })) : [{
                    page: source.page,
                    path: source.path,
                    title,
                    snippet: summary.slice(0, 180),
                    body: `${title} ${summary}`
                }];
            } catch (_error) {
                return [];
            }
        }));

        searchIndex = pages.flat();

        if (!searchIndex.length) {
            searchIndex = [
                {
                    page: "Home",
                    path: "/index.html",
                    title: "Portfolio homepage",
                    snippet: "Homepage overview, featured work, positioning, and calls to action.",
                    body: "home portfolio featured work about projects blogs"
                },
                {
                    page: "Publications",
                    path: "/blogs.html",
                    title: "Publications and writing",
                    snippet: "Protocols, papers, and technical writing connected to research work.",
                    body: "publications writing articles protocol papers"
                },
                {
                    page: "Projects",
                    path: "/projects/",
                    title: "Case studies and selected projects",
                    snippet: "Project summaries, contributions, and outcomes.",
                    body: "projects case studies work outcomes"
                },
                {
                    page: "Blogs",
                    path: "/blogs/",
                    title: "Blogs and future-facing technical writing",
                    snippet: "Long-form blogs on AI research, multimodal systems, and future technology.",
                    body: "blogs essays writing ai multimodal systems future technology research"
                },
                {
                    page: "About",
                    path: "/about.html",
                    title: "Profile and background",
                    snippet: "Background, capabilities, timeline, and contact details.",
                    body: "about profile background contact timeline"
                }
            ];
        }
    }

    function renderResults(query) {
        if (!searchResults || !searchStatus) {
            return;
        }

        if (!query) {
            searchStatus.textContent = "";
            searchResults.innerHTML = "";
            return;
        }

        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const matches = searchIndex
            .map((entry) => {
                const haystack = `${entry.page} ${entry.title} ${entry.snippet} ${entry.body}`.toLowerCase();
                const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
                return { ...entry, score };
            })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        searchStatus.textContent = matches.length ? `${matches.length} result${matches.length === 1 ? "" : "s"} for "${query}"` : `No results for "${query}"`;

        if (!matches.length) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    No results found.
                </div>
            `;
            return;
        }

        searchResults.innerHTML = matches.map((entry) => `
            <a class="search-result" href="${entry.path}">
                <div class="search-result-header">
                    <span class="search-path">${entry.page}</span>
                </div>
                <h3>${entry.title}</h3>
                <p class="search-snippet">${entry.snippet}</p>
            </a>
        `).join("");
    }
});
