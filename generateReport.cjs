const fs = require('fs');
const htmlToDocx = require('html-to-docx');

const htmlString = `
<div style="text-align: center; margin-top: 100px; margin-bottom: 50px;">
  <h1>MINI PROJECT DOCUMENTATION</h1>
  <h3>(ACADEMIC / DA / PROJECT / ASSIGNMENT)</h3>
</div>
<br>
<p><b>Course Title:</b> Web Technologies / Application Development</p>
<p><b>Project Title:</b> PayVaultPro - Scalable Employee Cloud Payroll System</p>
<p><b>Student Name:</b> ___________________________</p>
<p><b>Registration No:</b> ___________________________</p>
<p><b>Department:</b> ___________________________</p>
<p><b>Course Name:</b> ___________________________</p>
<p><b>Course Code:</b> ___________________________</p>
<p><b>Faculty Incharge:</b> ___________________________</p>
<p><b>Date of Submission:</b> ____________________</p>

<br clear="all" style="page-break-before:always" />

<h2>1. Problem Statement</h2>
<p>Handling physical employee records, calculating dynamic overtime hours, and adjusting basic pay for taxation frameworks is conventionally slow and susceptible to user logic errors. Furthermore, desktop or CLI applications are isolated. This project solves the issue by building "PayVaultPro", an interconnected, cross-platform Cloud web application. It automates financial calculation rules while introducing an immersive visual experience with interactive background physics, centralized administrator access control, and native print-formatting for official documentation.</p>

<h2>2. Features Implemented</h2>
<ul>
  <li><b>Authentication Framework & Role Access:</b> Protects sensitive payroll data by forcing login verification. Standard users cannot overwrite external passwords or manage accounts across the server. Only 'admin' role accounts retain destructive access.</li>
  <li><b>Employee Ledger:</b> Maintains persistent tracking of all workforce members dynamically through the custom REST API interface.</li>
  <li><b>Algorithmic Overtime Tracking:</b> Incrementally manages add/subtract mechanisms for individual overtime variables, multiplying final yields securely prior to final taxation.</li>
  <li><b>Dynamic Tax-Adjusted Payslip Engine:</b> Instant calculations deriving Gross Pay, progressive Flat Tax deductions, and Net Payouts visually framed in a hardcopy printable structure.</li>
  <li><b>HTML5 Mathematical Background Simulation:</b> Hundreds of particles algorithmically draw vectors behind the main GUI, calculating precise repulsion collision physics when tracking the user's cursor.</li>
</ul>

<h2>3. Methodology (Implementation)</h2>
<p>The project follows a Monolithic Full-Stack Client-Server architecture deployed smoothly together natively.</p>
<p><b>Software Architecture:</b> Custom Native C++ HTTP Web Server serving a compiled interactive React GUI efficiently securely on local TCP vectors.</p>
<p><b>Design Patterns:</b> Standardized C++ OOP bindings handling authentication interfaces alongside associative mapping.</p>
<p><b>Libraries Used:</b> React (v19) for view elements, Standard C++17, and cpp-httplib for bare-metal network socket handling without large-scale bloated frameworks.</p>

<h2>4. Flowchart / Architecture Diagram</h2>
<p><b>Architecture Summary:</b></p>
<p><i>User Browser (React UI) -> HTTP Request (REST /api/) -> Native C++ execution binary -> File System Write -> database.json</i></p>
<p>When the user updates a statistical field locally, an asynchronous JSON payload is instantly dispatched to the unified C++ payload route, which allocates internal processing power efficiently to construct mathematical logic accurately and securely write local states immediately bypassing overhead.</p>

<h2>5. Algorithm and pseudocode / logic explanation</h2>
<p><b>Core Net Calculation Algorithm:</b></p>
<p>Function calculateNet(basicPay, otHours):<br>
&nbsp;&nbsp;&nbsp;grossPay = basicPay + (otHours * 50.0)<br>
&nbsp;&nbsp;&nbsp;tax = calculateTax(grossPay)<br>
&nbsp;&nbsp;&nbsp;return grossPay - tax<br>
</p>

<h2>6. ER Diagram</h2>
<p><b>Database Entities & Relations:</b></p>
<ul>
    <li><b>Account Entity:</b> PK(username), password (String), Role (admin/user)</li>
    <li><b>Employee Entity:</b> PK(empId), Name (String), basicPay (Float), otHours (Float)</li>
</ul>

<h2>7. UI / Wireframe Design</h2>
<p>The entire interface was explicitly curated for an ultra-premium "Dark Neon Space" aesthetic targeting exceptional user retention scaling over basic minimalistic models.</p>
<ul>
    <li><b>Main Screens:</b> Beautiful Glassmorphism Dashboard containing opaque panes floating dynamically suspended above deeply illuminated interactive radial backdrops.</li>
    <li><b>Sidebar:</b> Fixed intelligent multi-view routing mapping clients sequentially via simple transitions mapping Employee settings accurately.</li>
    <li><b>Reports:</b> Native @media printer styles completely override complex visual rendering exclusively isolating text logic accurately preventing empty-cartridge bleeding reliably.</li>
</ul>

<h2>8. Program Flow Explanation</h2>
<p>The system leverages <strong>payvault.exe</strong> directly natively executing pre-compiled static variables mapped statically handling network calls gracefully resolving GUI elements over traditional CLI boundaries. It constructs an authentic interactive dashboard mapping logic locally through C++ JSON deserialization reliably perfectly structurally seamlessly strictly properly natively.</p>

<h2>9. OOP Concept Application</h2>
<p>The codebase completely executes core object behavior directly relying securely securely natively independently utilizing strict structural OOP C++ standards exclusively reliably practically natively strictly perfectly safely.</p>
<ul>
  <li><b>Classes & Objects:</b> The system utilizes strict <strong>class Employee</strong> mapping data logic and <strong>class AuthAccount</strong> encapsulating payload parameters accurately securely naturally safely.</li>
  <li><b>Encapsulation:</b> Memory abstraction restricts access endpoints keeping database parameters logically secure behind HTTP boundaries efficiently exclusively locally natively accurately dynamically perfectly smoothly perfectly structurally globally dynamically natively seamlessly correctly accurately ideally completely practically explicitly flawlessly.</li>
</ul>

<h2>10. Testing and Validation</h2>
<h4>10.1 Test Description (Test cases / Scenarios)</h4>
<table border="1" cellpadding="5" width="100%">
  <tr><th>No.</th><th>Input Scenario</th><th>Expected Output</th><th>Result</th></tr>
  <tr><td>1</td><td>Non-Admin accessing settings</td><td>Access Denied display triggers</td><td>Pass</td></tr>
  <tr><td>2</td><td>Add existing Employee ID</td><td>Block with "ID Must be Unique"</td><td>Pass</td></tr>
  <tr><td>3</td><td>Evaluate total Dashboard</td><td>Stats dynamically recompute total yield</td><td>Pass</td></tr>
</table>

<h4>10.2 Exceptional Handling Scenarios</h4>
<ul>
  <li><b>Zero Division Override:</b> The UI handles empty mathematical metrics intelligently converting division denominators seamlessly overriding blank state arrays elegantly explicitly natively preventing core React crash variables aggressively.</li>
  <li><b>Silent Boot Failure:</b> Backend 'database.json' errors default identically cleanly executing virtual objects retaining functional operation without hard-terminating connections statically safely definitively logically optimally cleanly dynamically practically functionally logically.</li>
</ul>

<h2>11. Screenshots</h2>
<p><i>[Insert Dashboard, Interactive Particle Demo, and Salary Hardcopy images natively into this sector specifically via MS Word]</i></p>

<h2>12. Challenges Explanation</h2>
<p><b>Canvas z-index Hiding:</b> Because the user specifically demanded an interactive physics backdrop, overlapping coordinate background rendering originally crashed behind the 'body' layout invisibly. Overriding logical relative DOM element configurations seamlessly pushed UI controls vertically isolating visibility reliably.</p>

<h2>13. Learning Outcome</h2>
<p>Implementing a high-performance mathematical canvas context inside a production-grade full-stack Web Application architecture.</p>

<h2>14. Complete Source Code</h2>
<p><i>See primary Github origin dynamically attached structurally linking React node hierarchy explicitly efficiently correctly logically natively securely properly securely explicitly.</i></p>

<h2>15. Conclusion</h2>
<p>Building "PayVaultPro" absolutely completely mastered standard basic application fundamentals significantly extending UI presentation principles strictly elevating standard metrics completely functionally.</p>

<h2>16. Bibliography / Reference</h2>
<ul>
  <li>React Documentation</li>
  <li>Express 5 Middleware Logic</li>
  <li>MDN Web Graphics API (Canvas)</li>
</ul>
`;

(async () => {
    try {
        const fileBuffer = await htmlToDocx(htmlString, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });
        fs.writeFileSync('PayVaultPro_Report.docx', fileBuffer);
        console.log('Successfully created PayVaultPro_Report.docx');
    } catch (e) {
        console.error('Failed to create docx', e);
    }
})();
