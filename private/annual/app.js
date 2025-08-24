// Generate 4 Annual Filing RTF docs
(function(){
  const $=(id)=>document.getElementById(id);
  const esc=s=>!s?"":String(s).replace(/\\/g,"\\\\").replace(/{/g,"\\{").replace(/}/g,"\\}").replace(/\n/g,"\\line ");
  const rtf=(title,lines)=>"{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\fs22 \\b "+esc(title)+"\\b0\\line\\line "+(lines||[]).map(esc).join("\\line ")+"}";

  function add(container,name,content){
    const a=document.createElement("a");
    a.className="dl";a.href=URL.createObjectURL(new Blob([content],{type:"application/rtf"}));
    a.download=name;a.textContent="Download "+name;container.appendChild(a);
  }

  function parseShareholders(text){
    const rows=[];(text||"").split(/[\r\n]+/).forEach(line=>{
      const parts=line.split("|").map(s=>s.trim());
      if(parts.filter(Boolean).length){const [name="",addr="",shares="",folio=""]=parts;rows.push({name,addr,shares,folio});}
    });return rows;
  }
  const bullets=t=> (t||"").split(/[\r\n]+/).map(s=>s.trim().replace(/^\-\s*/,"")).filter(Boolean).map(s=>"• "+s);

  function gen(){
    const company=$("companyName").value||"<--Company Name-->",
          cin=$("cin").value||"<--CIN-->",
          reg=$("regAddress").value||"<--Registered Office-->",
          fyEnd=$("fyEnd").value||"<--FY End-->",
          agmDate=$("agmDate").value||"<--AGM Date-->",
          agmTime=$("agmTime").value||"<--AGM Time-->",
          agmVenue=$("agmVenue").value||"<--AGM Venue-->",
          chair=$("chairperson").value||"<--Chairperson-->",
          cs=$("companySecretary").value||"<--Company Secretary-->",
          directors=($("directors").value||"").split(",").map(s=>s.trim()).filter(Boolean),
          sh=parseShareholders($("shareholders").value),
          notes=bullets($("reportNotes").value);

    const out=$("downloads"); out.innerHTML="";

    // 1) AGM Notice
    const nTitle="Notice of Annual General Meeting";
    const nBody=[
      "To,","The Members,",company+",",reg,"",
      "NOTICE is hereby given that the Annual General Meeting (AGM) of the members of "+company+" (CIN: "+cin+") will be held on "+agmDate+" at "+agmTime+" at "+agmVenue+" to transact the following business:","",
      "ORDINARY BUSINESS:",
      "1. To receive, consider and adopt the audited financial statements for the financial year ended "+fyEnd+" together with the Reports of the Board of Directors and Auditors thereon.",
      "2. To appoint a Director in place of one who retires by rotation, if applicable.","",
      "By Order of the Board,",company,"Chairperson: "+chair,"Date: "+agmDate
    ];
    add(out,"1_AGM_Notice.rtf", rtf(nTitle, nBody));

    // 2) List of Shareholders
    const rows = sh.length ? sh.map((r,i)=>(i+1)+") "+r.name+" — "+r.shares+" shares — "+r.folio+" — "+r.addr)
                           : ["<--Add shareholders: Name | Address | Shares | Folio-->"];
    add(out,"2_List_of_Shareholders.rtf", rtf("List of Shareholders",[
      company+" – Register of Members (as on AGM date)","CIN: "+cin,"",
      "S. No. | Name | Address | Shares | Folio/DP-Client ID",
      "------------------------------------------------------"
    ].concat(rows)));

    // 3) Directors' Report (simplified)
    const dirNames = directors.length? directors.join(", ") : "<--Directors-->";
    const repBody=[
      "To,","The Members, "+company,"",
      "Your Directors present their Report together with the audited financial statements for the year ended "+fyEnd+".","",
      "Overview & Highlights:"
    ].concat(notes.length? notes : ["• <Add highlights>"]).concat([
      "","Financial Results:","<Insert summary>","",
      "Dividend:","<Recommended / Not recommended>","",
      "Directors and KMP:","The Board comprises: "+dirNames+".","",
      "Meetings of the Board:","Details available in company records.","",
      "Directors’ Responsibility Statement (Sec 134(5)):", 
      "a) AS followed; b) policies applied consistently; c) adequate records; d) going concern; e) IFC operating effectively.","",
      "For and on behalf of the Board",company,"Chairperson: "+chair,"Date: "+agmDate
    ]);
    add(out,"3_Directors_Report.rtf", rtf("Directors' Report", repBody));

    // 4) AGM Attendance Sheet
    const att=[
      company+" – Attendance Sheet (AGM on "+agmDate+" at "+agmTime+")","Venue: "+agmVenue,"",
      "S. No. | Name of Member | Folio/DP-ID | No. of Shares | Signature",
      "-----------------------------------------------------------------",
      "1) ______________________________________  ____________________  _______________  _______________",
      "2) ______________________________________  ____________________  _______________  _______________",
      "3) ______________________________________  ____________________  _______________  _______________","",
      "Certified true attendance list.","For and on behalf of the Board",company,"Chairperson: "+chair
    ];
    add(out,"4_AGM_Attendance_Sheet.rtf", rtf("AGM Attendance Sheet", att));

    out.scrollIntoView({behavior:"smooth"});
  }

  document.getElementById("generateAll").addEventListener("click", gen);
})();