const button =
    document.getElementById("generateBtn");

button.addEventListener(
    "click",
    async () => {

        const file =
            document.getElementById("resume")
                .files[0];

        const jd =
            document.getElementById("jd")
                .value;

        const fullName =
            document.getElementById("fullName")
                .value;

        const phone =
            document.getElementById("phone")
                .value;

        const email =
            document.getElementById("email")
                .value;

        const linkedin =
            document.getElementById("linkedin")
                .value;
				
	    const address =
			document.getElementById("address")
				.value;

		const achievements =
			document.getElementById("achievements")
				.value;

        if (
            !file ||
            !jd ||
            !fullName
        ) {

            alert(
                "Fill all required fields"
            );

            return;
        }

        const formData =
            new FormData();

        formData.append(
            "resume",
            file
        );

        formData.append(
            "jd",
            jd
        );

        formData.append(
            "fullName",
            fullName
        );

        formData.append(
            "phone",
            phone
        );

        formData.append(
            "email",
            email
        );

        formData.append(
            "linkedin",
            linkedin
        );
		
		formData.append(
			"address",
			address
		);

		formData.append(
			"achievements",
			achievements
		);

        document.getElementById(
            "status"
        ).innerText =
            "Generating optimized resume...";

        const response =
            await fetch(
                "/api/resume/optimize",
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {

            alert(
                "Resume generation failed"
            );

            return;
        }

        const blob =
            await response.blob();

        const url =
            window.URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "optimized_resume.docx";

        document.body.appendChild(a);

        a.click();

        a.remove();

        document.getElementById(
            "status"
        ).innerText =
            "Resume generated successfully!";
    }
);