import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link
} from '@react-pdf/renderer';

// Modern & Bold Theme Configuration
const theme = {
    colors: {
        primary: '#1E3A5F', // Deep Blue accent (as requested)
        secondary: '#2D2D2D', // Charcoal for sharp contrast
        background: '#FFFFFF', // High contrast white background
        textBody: '#475569', // Readable slate for body text
        divider: '#E2E8F0', // Light border lines
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        xxl: 32,
    },
};

// Proper PDF-compatible inline styles using StyleSheet.create()
const styles = StyleSheet.create({
    page: {
        paddingTop: 45,
        paddingBottom: 45,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: theme.colors.background,
        fontFamily: 'Helvetica',
    },
    // ----- HEADER -----
    headerContainer: {
        marginBottom: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    name: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: theme.spacing.xs,
    },
    title: {
        fontSize: 14,
        color: theme.colors.secondary,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: theme.spacing.sm,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: theme.spacing.xs,
    },
    contactDivider: {
        marginHorizontal: 8,
        color: theme.colors.secondary,
        fontSize: 10,
    },
    contactItem: {
        fontSize: 10,
        color: theme.colors.secondary,
    },
    link: {
        color: theme.colors.primary,
        textDecoration: 'none',
    },

    // ----- SECTIONS -----
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
        paddingBottom: 4,
        position: 'relative',
    },
    sectionAccent: {
        position: 'absolute',
        left: 0,
        bottom: -1,
        width: 32,
        height: 3,
        backgroundColor: theme.colors.primary,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // ----- SUMMARY -----
    summaryText: {
        fontSize: 10.5,
        lineHeight: 1.6,
        color: theme.colors.textBody,
    },

    // ----- EXPERIENCE -----
    experienceBlock: {
        marginBottom: theme.spacing.md,
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    roleTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: theme.colors.secondary,
    },
    companyName: {
        fontSize: 12,
        color: theme.colors.primary,
        fontFamily: 'Helvetica-Bold',
    },
    dateLocation: {
        fontSize: 10,
        color: '#64748B',
        fontStyle: 'italic',
        textAlign: 'right',
    },
    bulletPointContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
    },
    bulletPointIcon: {
        width: 10,
        fontSize: 12,
        lineHeight: 1.2,
        color: theme.colors.primary,
    },
    bulletPointText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.5,
        color: theme.colors.textBody,
    },

    // ----- SKILLS -----
    skillRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xs,
        paddingLeft: theme.spacing.xs,
    },
    skillCategory: {
        width: '25%',
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: theme.colors.secondary,
    },
    skillItems: {
        width: '75%',
        fontSize: 10,
        color: theme.colors.textBody,
        lineHeight: 1.4,
    },

    // ----- EDUCATION -----
    educationBlock: {
        marginBottom: theme.spacing.sm,
    },
    degree: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: theme.colors.secondary,
        marginBottom: 2,
    },
    schoolName: {
        fontSize: 10,
        color: theme.colors.primary,
        fontFamily: 'Helvetica',
    },

    // ----- OTHER -----
    otherContent: {
        fontSize: 10,
        lineHeight: 1.5,
        color: theme.colors.textBody,
    }
});

// Modularity: Separate Reusable Sub-components

const Header = ({ name, title, email, phone, location, linkedin, github }) => {
    const contactArray = [];
    if (email) contactArray.push(<Text key="email" style={styles.contactItem}>{email}</Text>);
    if (phone) contactArray.push(<Text key="phone" style={styles.contactItem}>{phone}</Text>);
    if (location) contactArray.push(<Text key="location" style={styles.contactItem}>{location}</Text>);
    if (linkedin) contactArray.push(
        <Link key="linkedin" src={`https://${linkedin}`} style={styles.contactItem}>
            <Text style={styles.link}>{linkedin}</Text>
        </Link>
    );
    if (github) contactArray.push(
        <Link key="github" src={`https://${github}`} style={styles.contactItem}>
            <Text style={styles.link}>{github}</Text>
        </Link>
    );

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.contactRow}>
                {contactArray.map((item, index) => (
                    <React.Fragment key={index}>
                        {item}
                        {index < contactArray.length - 1 && (
                            <Text style={styles.contactDivider}> | </Text>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {/* Accent line beneath the section heading */}
            <View style={styles.sectionAccent} />
        </View>
        <View>{children}</View>
    </View>
);

const ExperienceItem = ({ company, role, date, location, bullets }) => (
    <View style={styles.experienceBlock}>
        <View style={styles.experienceHeader}>
            <View>
                <Text style={styles.roleTitle}>{role}</Text>
                <Text style={styles.companyName}>{company}</Text>
            </View>
            <View>
                <Text style={styles.dateLocation}>{date}</Text>
                <Text style={styles.dateLocation}>{location}</Text>
            </View>
        </View>
        {bullets && bullets.map((item, index) => (
            <View key={index} style={styles.bulletPointContainer}>
                <Text style={styles.bulletPointIcon}>• </Text>
                <Text style={styles.bulletPointText}>{item}</Text>
            </View>
        ))}
    </View>
);

const SkillsBlock = ({ category, skills }) => (
    <View style={styles.skillRow}>
        <Text style={styles.skillCategory}>{category}</Text>
        <Text style={styles.skillItems}>{skills.join(' • ')}</Text>
    </View>
);

const EducationItem = ({ school, degree, date, description }) => (
    <View style={styles.educationBlock}>
        <View style={styles.experienceHeader}>
            <View>
                <Text style={styles.degree}>{degree}</Text>
                <Text style={styles.schoolName}>{school}</Text>
            </View>
            <View>
                <Text style={styles.dateLocation}>{date}</Text>
            </View>
        </View>
        {description && <Text style={styles.otherContent}>{description}</Text>}
    </View>
);

// Main PDF Component
// Props accept a `data` object to dynamically fill resume parts
export default function ResumePDF({ data }) {
    if (!data) return null; // Safe guard

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* 1. Header & Contact Info */}
                <Header
                    name={data.name || "Alex M. Chen"}
                    title={data.title || "Senior Software Engineer"}
                    email={data.email || "alex.chen@example.com"}
                    phone={data.phone || "+1 (555) 123-4567"}
                    location={data.location || "San Francisco, CA"}
                    linkedin={data.linkedin || "linkedin.com/in/alexchen"}
                    github={data.github || "github.com/alexchen"}
                />

                {/* 2. Summary */}
                <Section title="Professional Summary">
                    <Text style={styles.summaryText}>
                        {data.summary || "Results-oriented software engineer with strong experience in scalable systems, modern cloud architecture, and intuitive web frameworks. Proven track record of improving application performance by over 40% and leading cross-functional teams to deliver enterprise-grade software on schedule. Passionate about clean code, robust CI/CD pipelines, and driving high-impact product innovation."}
                    </Text>
                </Section>

                {/* 3. Experience */}
                <Section title="Experience">
                    {data.experience ? data.experience.map((exp, idx) => (
                        <ExperienceItem
                            key={idx}
                            company={exp.company}
                            role={exp.role}
                            date={exp.date}
                            location={exp.location}
                            bullets={exp.bullets}
                        />
                    )) : (
                        <>
                            <ExperienceItem
                                company="TechCorp Innovations"
                                role="Senior Software Engineer"
                                date="Jan 2021 - Present"
                                location="San Francisco, CA"
                                bullets={[
                                    "Engineered scalable cloud architecture using AWS and Kubernetes, increasing deployment velocity by 40%.",
                                    "Slashed Time To First Byte (TTFB) by 300ms, elevating overall conversion rates by 12% across 5 core platforms.",
                                    "Mentored 4 junior developers and established automated testing protocols using Jest and Cypress."
                                ]}
                            />
                            <ExperienceItem
                                company="Nexus Systems"
                                role="Software Engineer"
                                date="Mar 2018 - Dec 2020"
                                location="Austin, TX"
                                bullets={[
                                    "Developed RESTful APIs with Node.js and Express processing 2M+ requests per day with 99.99% uptime.",
                                    "Migrated legacy React codebase to modern hooks and functional components, reducing bundle size by 25%.",
                                    "Collaborated with UX team to redesign main dashboard, leading to a 35% increase in user retention."
                                ]}
                            />
                        </>
                    )}
                </Section>

                {/* 4. Skills */}
                <Section title="Technical Skills">
                    {data.skillsList ? data.skillsList.map((skill, idx) => (
                        <SkillsBlock key={idx} category={skill.category} skills={skill.items} />
                    )) : (
                        <>
                            <SkillsBlock category="Core Languages" skills={['JavaScript (ES6+)', 'TypeScript', 'Python', 'Go', 'SQL']} />
                            <SkillsBlock category="Frontend Specs" skills={['React', 'Next.js', 'Redux Ecosystem', 'Tailwind CSS', 'Framer Motion']} />
                            <SkillsBlock category="Backend & Cloud" skills={['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker']} />
                            <SkillsBlock category="Dev & Practices" skills={['Git', 'CI/CD Pipelines', 'Agile/Scrum', 'Test-Driven Development']} />
                        </>
                    )}
                </Section>

                {/* 5. Education */}
                <Section title="Education">
                    {data.education ? data.education.map((edu, idx) => (
                        <EducationItem
                            key={idx}
                            degree={edu.degree}
                            school={edu.school}
                            date={edu.date}
                        />
                    )) : (
                        <EducationItem
                            degree="B.S. in Computer Science"
                            school="University of California, Berkeley"
                            date="2014 - 2018"
                        />
                    )}
                </Section>

                {/* 6. Other (e.g., Projects, Awards, Certifications) */}
                <Section title="Awards & Certifications">
                    {data.other ? <Text style={styles.otherContent}>{data.other}</Text> : (
                        <Text style={styles.otherContent}>
                            AWS Certified Solutions Architect – Associate (2022) {"\n"}
                            First Place Winner – Global FinTech Hackathon (2019)
                        </Text>
                    )}
                </Section>

            </Page>
        </Document>
    );
}
