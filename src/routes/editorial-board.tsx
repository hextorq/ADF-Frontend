import { PageHeader } from "@/components/site/PageHeader";

const BOARD = [
  // Editor-in-Chief & Managing Editor
  {
    name: "Dr. Attrait Dovin Fedrick",
    role: "Editor-in-Chief & Managing Editor",
    aff: "Chairman, Academic Development Forum, Thoothukudi, Tamil Nadu, India",
    email: "academicdevelopmentforum24@gmail.com",
    initials: "ADF",
  },

  // Technical & Ethics Editor
  {
    name: "Dr. Cynthiya Rose J. S.",
    role: "Technical & Ethics Editor",
    aff: "Assistant Professor, Department of English, PESU Institute of Nursing, PES University, Bangalore",
    initials: "CJ",
  },
  {
    name: "Prof. Caro Velma J",
    role: "Technical & Ethics Editor",
    aff: "Assistant Professor of English, Holy Cross College, Tiruchirappalli, Tamil Nadu, India",
    initials: "CV",
  },

  // Associate Editors
  {
    name: "Dr. M Richard Robert Raa",
    role: "Associate Editor",
    aff: "Associate Professor of English, Nehru Arts and Science College, Coimbatore",
    email: "nascdrrichard@nehrucolleges.com",
    initials: "MR",
  },
  {
    name: "Dr. Prasanth Arokia Samy D",
    role: "Associate Editor",
    aff: "Assistant Professor of English, St. Joseph's College, Tiruchirappalli",
    email: "prasantharokiasamy_en2@mail.sjctni.edu",
    initials: "PA",
  },
  {
    name: "Dr. Baskar Duraisamy",
    role: "Associate Editor",
    aff: "Associate Professor, Dept. of Electronics and Communication Engineering, Karpagam Institute of Technology, Coimbatore",
    email: "baskardr@gmail.com",
    initials: "BD",
  },
  {
    name: "Prof. Glory Santha Vinothini A",
    role: "Associate Editor",
    aff: "Assistant Professor, Dept. of Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore",
    email: "ags.vinothini@gmail.com",
    initials: "GS",
  },
  {
    name: "Dr. Maheshkumar Sankar",
    role: "Associate Editor",
    aff: "Assistant Professor, Dept. of MBA, Sathyabama Institute of Science and Technology, Sriperumbudur Campus",
    email: "maheshkumar.sankar.soms.spd@sathyabama.ac.in",
    initials: "MS",
  },
  {
    name: "Dr. C.KANDASAMY",
    role: "Associate Editor",
    aff: "Associate Professor, Department of Commerce, Dr. N.G.P. Arts and Science College, Coimbatore",
    email: "ckandasamy@drngpasc.ac.in",
    initials: "CK",
  },
  {
    name: "Dr. Panbuselvan P",
    role: "Associate Editor",
    aff: "Assistant Professor, Dept. of Visual Communication and E Media, PSG College of Arts and Science, Coimbatore",
    email: "panbuselvan@psgcas.ac.in",
    initials: "PP",
  },
  {
    name: "Dr. Manoj Sekaran",
    role: "Associate Editor",
    aff: "Department of Biotechnology, School of Bio Sciences and Technology, Vellore Institute of Technology, Vellore",
    email: "manojsekaranr@gmail.com",
    initials: "MS",
  },
  {
    name: "Dr. Siugand Akbarian",
    role: "Associate Editor",
    aff: "Assistant professor, Imam Abdulrahman Bin Faisal University (IAU)",
    email: "sougand_akbarian@yahoo.com",
    initials: "SA",
  },
  {
    name: "Dr. Sreejith Ramachandran",
    role: "Associate Editor",
    aff: "Associate Professor and Head, Department of English at Acharya University, Karakul, Uzbekistan",
    email: "sreejith11@acharya.ac.uz",
    initials: "SR",
  },
  {
    name: "Dr. Gamaya K P",
    role: "Associate Editor",
    aff: "Senior Assistant Professor, Department of English at Acharya University, Karakul, Uzbekistan",
    email: "gamaya10@acharya.ac.uz",
    initials: "GK",
  },
  {
    name: "Dr. D. Pradeek",
    role: "Associate Editor",
    aff: "Assistant professor of English, Department of Science and Humanities, Hindusthan Institute of Technology, Coimbatore",
    email: "dr.pradeek@hit.edu.in",
    initials: "DP",
  },
  {
    name: "Mr. Nithiyanandam",
    role: "Associate Editor",
    aff: "English Language Instructor, Department of English Language Teaching, Jaffna University, Sri Lanka",
    email: "antonynithyanandamsl@gmail.com",
    initials: "MN",
  },
  {
    name: "Dr. Mohammed Raffic N",
    role: "Associate Editor",
    aff: "Assistant Professor (SG)/Aeronautical Engineering, Nehru Institute of Technology, Coimbatore",
    email: "drmrfnoor@gmail.com",
    initials: "MR",
  },

  // Advisory Board
  {
    name: "Dr. A.J. Divya",
    role: "Advisory Board",
    aff: "Assistant Professor, UNNAMALAI INSTITUTE OF TECHNOLOGY",
    email: "divyasnh@uitkovilpatti.ac.in",
    initials: "AD",
  },
  {
    name: "Dr. Joseph Mathew",
    role: "Advisory Board",
    aff: "Assistant Professor, Department of English, PSG Arts and Science College, Coimbatore",
    email: "josephmathew0905@gmail.com",
    initials: "JM",
  },
  {
    name: "Dr. G. Hemalatha",
    role: "Advisory Board",
    aff: "Assistant Professor, Department of English & Foreign Languages, Madanapalle Institute of Technology & Science (MITS)",
    email: "hemaenglit@gmail.com",
    initials: "GH",
  },
  {
    name: "Dr. Naseer Ud Din Sofi",
    role: "Advisory Board",
    aff: "Assistant prof English, Faculty of Liberal Arts, Desh Bhagat University Mandi Gobindgrah Chandigarh",
    email: "nsofi72@gmail.com",
    initials: "NS",
  },
  {
    name: "Dr. SONIKA KUMARI",
    role: "Advisory Board",
    aff: "NIET, College, Greater Noida, Delhi NCR",
    email: "sonika.kumari@niet.co.in",
    initials: "SK",
  },
  {
    name: "Dr. Ishrat Jahan",
    role: "Advisory Board",
    aff: "Post Doctoral Fellow, Maulana Azad National Urdu University, Gachibowli, Hyderabad",
    email: "ishrat.ahamad@gmail.com",
    initials: "IJ",
  },
  {
    name: "Dr. K. Lakshmi Priya",
    role: "Advisory Board",
    aff: "Assistant Professor, Shrimathi Devkunvar Nanalal Bhatt Vaishnav College for Women, Chrompet, Chennai",
    email: "vickyharipriya@gmail.com",
    initials: "LP",
  },
];

export default function Page() {
  const groups = ["Editor-in-Chief & Managing Editor", "Technical & Ethics Editor", "Associate Editor", "Advisory Board"];
  return (
    <>
      <PageHeader
        eyebrow="Editorial Board"
        title="A global editorial leadership"
        description="Scholars shaping the editorial direction of ADF journals and volumes."
        crumbs={[{ label: "Editorial Board" }]}
      />
      <section className="py-16 bg-white">
        <div className="container-academic space-y-16">
          {groups.map((g) => {
            const members = BOARD.filter((b) => b.role === g);
            if (members.length === 0) return null;
            return (
              <div key={g}>
                <h2 className="font-serif text-2xl font-bold text-[var(--ink)] border-b pb-3 mb-6">{g}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((b) => (
                    <div key={b.name} className="surface-card p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--deep)] text-white font-semibold text-lg shadow-inner">
                          {b.initials}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--ink)] text-lg">{b.name}</div>
                          <div className="text-sm font-medium text-[var(--primary)]">{b.role}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
                        {b.aff}
                      </div>
                      {b.email && (
                        <div className="mt-auto pt-4 border-t border-black/5">
                          <a href={`mailto:${b.email}`} className="text-sm text-[var(--mint)] hover:underline break-all">
                            {b.email}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}



