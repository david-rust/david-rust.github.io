## Shared Footer

The site footer is defined once and must be identical across every page. The canonical footer HTML is:

```html
<footer>
  <div class="footer-upper">
    <div>
      <div class="footer-wordmark">Kentucky <span>Cancer Registry</span></div>
      <p class="footer-desc">The official population-based central cancer registry for the Commonwealth of Kentucky, serving researchers, clinicians, and public health officials since 1990.</p>
    </div>
    <div>
      <div class="footer-col-title">Registry</div>
      <div class="footer-links">
        <a href="/about/" class="footer-link">About KCR</a>
        <a href="/research/" class="footer-link">Research</a>
        <a href="/staff/" class="footer-link">Staff Directory</a>
        <a href="/contact/" class="footer-link">Contact Us</a>
        <a href="/statutes/" class="footer-link">Privacy Statutes</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Data &amp; Tools</div>
      <div class="footer-links">
        <a href="https://www.cancer-rates.info/ky/" target="_blank" class="footer-link">cancer-rates.info</a>
        <a href="https://www.cancer-rates.info/ky/?datasource=all" target="_blank" class="footer-link">Incidence Rates</a>
        <a href="https://www.cancer-rates.info/ky/?datasource=mort" target="_blank" class="footer-link">Mortality Rates</a>
        <a href="https://www.kcr.uky.edu/childhood-report" target="_blank" class="footer-link">Childhood Cancer Report</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Technical</div>
      <div class="footer-links">
        <a href="/software/" class="footer-link">Software</a>
        <a href="/manuals/" class="footer-link">KCR Manuals</a>
        <a href="/training/" class="footer-link">Training</a>
        <a href="/resources/" class="footer-link">Technical Support</a>
        <a href="https://kcr-confluence.atlassian.net/wiki/spaces/kentuckyregistrarswiki/overview" target="_blank" class="footer-link">Registrars Wiki</a>
      </div>
    </div>
  </div>
  <div class="footer-lower">
    <span>&copy; 2026 Kentucky Cancer Registry &nbsp;&middot;&nbsp; <a href="mailto:kcr@uky.edu">kcr@uky.edu</a></span>
    <div style="display:flex;gap:24px;">
      <a href="https://www.uky.edu/" class="footer-link">University of Kentucky</a>
      <a href="https://ukhealthcare.uky.edu/markey-cancer-center" class="footer-link">Markey Cancer Center</a>
      <a href="https://www.kycancerc.org/" class="footer-link">KY Cancer Consortium</a>
      <a href="https://www.kcp.uky.edu/" class="footer-link">KY Cancer Program</a>
    </div>
  </div>
</footer>
```

**⚠️ When you update the footer:** You must apply the change to every HTML page in the project. There are 58 pages total (13 section pages + 45 staff profiles). Use find-and-replace across all `*.html` files or ask Claude to propagate the change.
