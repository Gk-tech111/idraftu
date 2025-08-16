// Frontend-only document generator for 5 Director Appointment docs (RTF)
(function() {
  const $ = (id) => document.getElementById(id);

  // Escape RTF special chars
  function rtfEscape(str) {
    if (!str) return "";
    return String(str)
      .replace(/\\/g, "\\\\")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/\n/g, "\\line ");
  }

  // Build a simple RTF document (basic font, line breaks)
  function makeRTF(title, bodyLines) {
    const header = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0\\fswiss Helvetica;}}\n";
    const titlePart = `\\fs32 \\b ${rtfEscape(title)} \\b0 \\fs24 \\line \\line \n`;
    const body = bodyLines.map(line => rtfEscape(line) + " \\line ").join("\n");
    const footer = "\n}";
    return header + titlePart + body + footer;
  }

  function download(filename, content) {
    const blob = new Blob([content], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return a;
  }

  function addDownloadLink(node, filename, content) {
    const blob = new Blob([content], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.textContent = `Download ${filename}`;
    node.appendChild(a);
  }

  function generateDocs() {
    const data = {
      companyName: $("companyName").value,
      meetingDate: $("meetingDate").value,
      meetingTime: $("meetingTime").value,
      meetingAddress: $("meetingAddress").value,
      name: $("name").value,
      din: $("din").value,
      appointmentDate: $("appointmentDate").value,
      directorName: $("directorName").value,
      pan: $("pan").value,
      email: $("email").value,
      mobile: $("mobile").value,
      fatherName: $("fatherName").value,
      residenceAddress: $("residenceAddress").value,
      place: $("place").value,
      mbp1Company: $("mbp1Company").value,
      mbp1Nature: $("mbp1Nature").value,
      mbp1Date: $("mbp1Date").value,
    };

    // Basic validation
    for (const [k,v] of Object.entries(data)) {
      if (!v && !["mbp1Company","mbp1Nature","mbp1Date"].includes(k)) {
        alert("Please fill: " + k);
        return;
      }
    }

    const downloadsDiv = $("downloads");
    downloadsDiv.innerHTML = "";

    // 1) Board Resolution (on letterhead)
    const boardTitle = "Board Resolution for Appointment of Director";
    const boardBody = [
      "(To be printed on company letterhead)",
      "",
      `CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ${data.companyName} HELD ON ${data.meetingDate} AT ${data.meetingTime} AT ${data.meetingAddress}`,
      "",
      `“RESOLVED THAT pursuant to the provisions of Section 152, Section 161(1) and other applicable provisions, if any, of the Companies Act, 2013 read with the Articles of Association of the Company, ${data.name}, holding DIN ${data.din}, who has consented to act as a Director of the Company, be and is hereby appointed as an Additional Director of the Company with effect from ${data.appointmentDate}, to hold office up to the date of the next Annual General Meeting or the last date on which the AGM should have been held, whichever is earlier.`,
      "",
      `RESOLVED FURTHER THAT ${data.directorName}, Director of the Company, be and is hereby authorized to file Form DIR-12 with the Registrar of Companies and to do all acts, deeds and things necessary in this regard.”`,
      "",
      `For ${data.companyName}`,
      "____________________________",
      `${data.directorName}`,
      "Director",
      `DIN: ${data.din}`,
    ];
    const boardRTF = makeRTF(boardTitle, boardBody);
    addDownloadLink(downloadsDiv, "1_Board_Resolution.rtf", boardRTF);

    // 2) DIR-2 Consent
    const dir2Title = "Consent to Act as Director (Form DIR-2)";
    const dir2Body = [
      "To,",
      "The Board of Directors,",
      data.companyName,
      data.meetingAddress,
      "",
      "Subject: Consent to act as Director",
      "",
      `I, ${data.name}, son/daughter of ${data.fatherName}, resident at ${data.residenceAddress}, having DIN ${data.din}, hereby give my consent to act as a Director of ${data.companyName} pursuant to Section 152(5) of the Companies Act, 2013.`,
      "",
      `a. PAN: ${data.pan}`,
      `b. Email ID: ${data.email}`,
      `c. Mobile No.: ${data.mobile}`,
      "",
      "I am not disqualified to become a director under Section 164(2) of the Companies Act, 2013.",
      "",
      `Date: ${data.meetingDate}`,
      `Place: ${data.place}`,
      "",
      "Signature: _____________________",
      data.name
    ];
    const dir2RTF = makeRTF(dir2Title, dir2Body);
    addDownloadLink(downloadsDiv, "2_DIR-2_Consent.rtf", dir2RTF);

    // 3) DIR-8 Declaration of Non-Disqualification
    const dir8Title = "Declaration of Non-Disqualification (Form DIR-8)";
    const dir8Body = [
      "To,",
      "The Board of Directors,",
      data.companyName,
      "",
      `I, ${data.name}, son/daughter of ${data.fatherName}, resident at ${data.residenceAddress}, having DIN ${data.din}, hereby declare that:`,
      "",
      "I have not been disqualified to act as a Director under Section 164(2) of the Companies Act, 2013.",
      "",
      "I am not debarred from holding the office of Director by an order of SEBI or any other authority.",
      "",
      `Date: ${data.meetingDate}`,
      `Place: ${data.place}`,
      "",
      "Signature: _____________________",
      data.name
    ];
    const dir8RTF = makeRTF(dir8Title, dir8Body);
    addDownloadLink(downloadsDiv, "3_DIR-8_Declaration.rtf", dir8RTF);

    // 4) MBP-1 Disclosure of Interest
    const mbp1Title = "Intimation by Director (Form MBP-1)";
    const mbp1TableHeader = "S. No.\tName of the Company/Body Corporate/Firm/Association\tNature of Interest\tDate of Interest";
    const mbp1Row = `1\t${data.mbp1Company || ""}\t${data.mbp1Nature || ""}\t${data.mbp1Date || ""}`;
    const mbp1Body = [
      "To,",
      "The Board of Directors,",
      data.companyName,
      "",
      "Subject: Disclosure of Interest under Section 184(1)",
      "",
      `I, ${data.name}, holding DIN ${data.din}, being appointed as a Director in ${data.companyName} with effect from ${data.appointmentDate}, hereby give notice of my concern or interest in other entities as per the details below:`,
      "",
      mbp1TableHeader,
      mbp1Row,
      "",
      "I declare that the information furnished is correct.",
      "",
      `Date: ${data.meetingDate}`,
      `Place: ${data.place}`,
      "",
      "Signature: _____________________",
      data.name
    ];
    const mbp1RTF = makeRTF(mbp1Title, mbp1Body);
    addDownloadLink(downloadsDiv, "4_MBP-1_Disclosure.rtf", mbp1RTF);

    // 5) DIR-12 Note (ROC filing)
    const dir12Title = "Notice of Appointment to ROC (Form DIR-12)";
    const dir12Body = [
      "(To be filed online at MCA portal)",
      "",
      "Attachments to DIR-12:",
      "",
      "1) Certified copy of Board Resolution (from Section 1 above)",
      "2) DIR-2 Consent to act as Director",
      "3) DIR-8 Declaration of non-disqualification",
      "4) Proof of identity and address of appointee",
      "5) MBP-1 Disclosure of interest"
    ];
    const dir12RTF = makeRTF(dir12Title, dir12Body);
    addDownloadLink(downloadsDiv, "5_DIR-12_Note.rtf", dir12RTF);

    // Scroll to downloads
    downloadsDiv.scrollIntoView({ behavior: "smooth" });
  }

  $("generateAll").addEventListener("click", generateDocs);
})();
