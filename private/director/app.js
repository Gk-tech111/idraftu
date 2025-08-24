// Generate 5 Director Appointment RTF docs
(function(){
  const $ = (id)=>document.getElementById(id);
  const esc = s => !s ? "" : String(s).replace(/\\/g,"\\\\").replace(/{/g,"\\{").replace(/}/g,"\\}").replace(/\n/g,"\\line ");
  const rtf = (title, lines)=>"{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\fs22 \\b "+esc(title)+"\\b0\\line\\line "+(lines||[]).map(esc).join("\\line ")+"}";

  function add(container,name,content){
    const a=document.createElement("a");
    a.className="dl";a.href=URL.createObjectURL(new Blob([content],{type:"application/rtf"}));
    a.download=name;a.textContent="Download "+name;
    container.appendChild(a);
  }

  function gen(){
    const company=$("companyName").value||"<--Company Name-->",
          cin=$("cin").value||"<--CIN-->",
          reg=$("regAddress").value||"<--Registered Office-->",
          mDate=$("meetingDate").value||"<--Date-->",
          mTime=$("meetingTime").value||"<--Time-->",
          venue=$("meetingVenue").value||"<--Venue-->",
          dName=$("directorName").value||"<--Director Name-->",
          din=$("din").value||"<--DIN-->",
          dAddr=$("directorAddress").value||"<--Director Address-->",
          mbp1=($("mbp1").value||"").split(/[\r\n]+/).filter(Boolean).map(s=>"• "+s);

    const out=$("downloads"); out.innerHTML="";
    // 1) Board Resolution
    add(out,"1_Board_Resolution_Appointment.rtf", rtf("Board Resolution – Appointment of Director",[
      company+" (CIN: "+cin+")",
      "Registered Office: "+reg,"",
      "RESOLVED THAT pursuant to Sections 152 and 161 of the Companies Act, 2013, "+dName+" (DIN: "+din+") be and is hereby appointed as an Additional Director of the Company with effect from "+mDate+".",
      "RESOLVED FURTHER THAT any Director or Company Secretary be and is hereby authorized to file necessary forms with the Registrar of Companies."
    ]));

    // 2) DIR-2 – Consent
    add(out,"2_DIR-2_Consent.rtf", rtf("DIR-2 – Consent to Act as Director",[
      "To, The Board of Directors, "+company,"",
      "I, "+dName+" (DIN: "+din+"), hereby give my consent to act as a Director of the Company.",
      "Address: "+dAddr,"Date: "+mDate
    ]));

    // 3) DIR-8 – Declaration
    add(out,"3_DIR-8_Declaration.rtf", rtf("DIR-8 – Declaration of Non-Disqualification",[
      "I, "+dName+" (DIN: "+din+"), do hereby declare that I am not disqualified from being appointed as a director under Section 164 of the Companies Act, 2013.",
      "Address: "+dAddr,"Date: "+mDate
    ]));

    // 4) MBP-1 – Disclosure of Interest (bullets)
    const mbpBody = ["Disclosure of Interests under Section 184(1) of the Companies Act, 2013:"]
      .concat(mbp1.length? mbp1 : ["• <No interests to disclose>"]);
    add(out,"4_MBP-1_Disclosure.rtf", rtf("MBP-1 – Disclosure of Interest", mbpBody));

    // 5) DIR-12 – Filing Note
    add(out,"5_DIR-12_Note.rtf", rtf("DIR-12 – Checklist / Note",[
      "Documents to be attached with DIR-12:",
      "• Certified copy of Board Resolution","• DIR-2 Consent","• DIR-8 Declaration","• Proof of identity and address of appointee","• MBP-1 (if applicable)",
      "Filing within 30 days of appointment."
    ]));

    out.scrollIntoView({behavior:"smooth"});
  }
  document.getElementById("generateAll").addEventListener("click", gen);
})();