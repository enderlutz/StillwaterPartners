-- Seed data for Stroke Scan Plus and Greenleaf Dental

-- ─── Clients ────────────────────────────────────────────────────────────────
insert into clients (id, name, industry, main_offer, current_status, goal_90_day, long_term_goal, next_actions, engagement_stage, health)
values
  (
    'stroke-scan-plus',
    'Stroke Scan Plus',
    'Preventive Health Screening',
    '$149 four-vessel preventive stroke & cardiovascular ultrasound screening',
    'Scaling paid acquisition in two DMAs',
    '400 paid screenings / month at CPA under $75',
    'Category leader for direct-to-consumer preventive stroke screening across the Sun Belt',
    array[
      'Launch senior-community referral program',
      'A/B test new landing page with risk calculator',
      'Open third screening location in Sarasota'
    ],
    'design',
    'on_track'
  ),
  (
    'greenleaf-dental',
    'Greenleaf Dental Group',
    'Multi-location Dental',
    '$79 new-patient cleaning + x-ray',
    'Onboarding — audit in progress',
    'Lift new-patient bookings 25% across 4 locations',
    'Expand to 10 locations in Texas by 2028',
    array['Finish ad account audit', 'Kick off landing page rebuild'],
    'diagnose',
    'at_risk'
  )
on conflict (id) do nothing;

-- ─── Brief (SSP only for now) ───────────────────────────────────────────────
insert into briefs (client_id, business_overview, target_audience, core_offer, pricing, upsells, competitors, marketing_channels, operational_constraints, notes)
values (
  'stroke-scan-plus',
  'Stroke Scan Plus operates mobile and fixed preventive screening clinics that detect early markers for stroke and cardiovascular disease using non-invasive ultrasound. Founded 2022; three clinics across Florida.',
  'Adults 50–75 with at least one cardiovascular risk factor. Decision makers skew female 55+ who also book for spouses.',
  '$149 four-vessel screening package: carotid artery, abdominal aorta, peripheral arterial, and EKG. 30-minute in-clinic visit. Results in 48 hours with cardiologist review.',
  'Base $149. Couples package $249. Premium $299 adds thyroid and full lipid panel. No insurance billing.',
  'Quarterly Heart Health membership $29/mo. Annual re-scan $99. Telehealth follow-up $79.',
  'Life Line Screening. Local hospital-based screening programs.',
  'Meta Ads (primary), Google Search, local radio, senior-community partnerships, referral program.',
  'Scanner capacity: 22 slots/day/clinic. Lead cardiologist signs all reports — bottleneck above 80 scans/day total.',
  'Founder prioritizes brand trust over volume. Strong aversion to aggressive upsell scripting.'
)
on conflict (client_id) do nothing;

-- ─── KPI entries ────────────────────────────────────────────────────────────
insert into kpi_entries (client_id, period_type, period_label, revenue_goal, revenue, patient_volume_goal, leads_goal, leads, bookings_goal, bookings, show_ups, show_up_rate, cost_per_lead, cost_per_booking, cost_per_show_up, ad_spend, profit_estimate) values
('stroke-scan-plus','monthly','Jan 2026',45000,41200,300,900,842,330,298,251,84.2,11.4,32.2,38.3,9600,17800),
('stroke-scan-plus','monthly','Feb 2026',50000,48900,330,1000,1104,360,342,296,86.5,9.9,31.9,36.9,10920,22100),
('stroke-scan-plus','monthly','Mar 2026',55000,57300,360,1100,1268,390,401,350,87.3,9.1,28.8,33.0,11540,27900),
('stroke-scan-plus','weekly','Apr wk 1',14000,15200,94,280,312,100,107,94,87.9,8.9,26.0,29.6,2780,7420);

-- ─── Initiatives ────────────────────────────────────────────────────────────
insert into initiatives (client_id, horizon, title, description, priority, owner, due_date, status, expected_impact, visibility) values
('stroke-scan-plus','short','Launch senior-community referral program','Partner with 8 active-adult communities for on-site screening days with co-branded flyers and a $20 resident discount.','high','Alan Bonner','2026-05-15','in_progress','+60 screenings/month at near-zero CAC','shared'),
('stroke-scan-plus','short','Ship landing page with risk calculator','Interactive 8-question stroke risk quiz that ends with calendar booking. Replaces current static LP.','high','Design team','2026-05-02','in_progress','Booking CVR 12% → 18%','shared'),
('stroke-scan-plus','mid','Open Sarasota clinic','Lease + buildout + cardiologist contract for third fixed location.','high','Founder','2026-08-30','not_started','+$45k MRR at steady state','shared'),
('stroke-scan-plus','mid','Build content engine','Weekly educational content: YouTube shorts, blog posts, email newsletter.','medium','Content lead','2026-07-01','not_started','Organic leads 5% → 20% of total','shared'),
('stroke-scan-plus','long','Expand to Sun Belt — AZ + TX','3 additional markets by end of 2027.','medium','Founder','2027-12-31','not_started','$3M ARR target','shared');

-- ─── Campaigns ──────────────────────────────────────────────────────────────
insert into campaigns (client_id, name, platform, target_location, budget, start_date, end_date, creative_angle, results, notes, status, visibility) values
('stroke-scan-plus','Meta — Tampa 55+ Awareness','Meta','Tampa–St. Petersburg DMA',4500,'2026-03-01','2026-04-30','Real patient story: "I had no symptoms. The scan caught a 70% blockage."','CPL $8.40, 312 bookings, ROAS 2.8x. Best performer of quarter.','Scale +30% budget in May','live','shared'),
('stroke-scan-plus','Google Search — Stroke Screening Keywords','Google','FL statewide',3200,'2026-02-15','2026-05-15','Direct response — "$149 four-vessel screening near you"','CPL $14.20, lower volume, higher show-up rate (91%)','High-intent — keep on always-on','live','shared'),
('stroke-scan-plus','Sarasota Launch Burst','Meta + Google','Sarasota / Bradenton',6000,'2026-09-01','2026-10-15','New clinic grand opening — first 100 scans $99','','Blocked by clinic buildout timeline','draft','shared');

-- ─── Meeting Notes ──────────────────────────────────────────────────────────
insert into meeting_notes (client_id, date, attendees, summary, key_facts, decisions, action_items, visibility) values
('stroke-scan-plus','2026-04-17',
  array['Alan Bonner','Dr. Patel (Founder)','Maria (Ops)'],
  'Q2 planning. Reviewed March KPIs (beat plan). Aligned on Sarasota buildout timing and senior-community program.',
  array[
    'March revenue $57.3k vs $55k goal',
    'Cardiologist bottleneck hit twice in March — capacity planning needed before Sarasota',
    'Dr. Patel open to adding second reader if we can forecast >500 scans/mo'
  ],
  array[
    'Move forward with Sarasota lease signing in May',
    'Delay content hire until June to concentrate spend on paid'
  ],
  '[{"item":"Send Sarasota lease options for review","owner":"Dr. Patel","deadline":"2026-04-25"},{"item":"Draft senior-community partnership one-pager","owner":"Alan","deadline":"2026-04-24"},{"item":"Scope second-reader economics","owner":"Maria","deadline":"2026-05-05"}]'::jsonb,
  'shared'),
('stroke-scan-plus','2026-04-03',
  array['Alan Bonner','Dr. Patel'],
  'Weekly standup. Paid is pacing ahead. LP rebuild draft reviewed — needs copy pass.',
  array['Meta CPL dropped to $8.40','New LP copy reads too clinical — Dr. Patel wants warmer voice'],
  array['Rewrite LP headline + hero copy before launch'],
  '[{"item":"LP copy rewrite v2","owner":"Alan","deadline":"2026-04-10"}]'::jsonb,
  'shared'),
('stroke-scan-plus','2026-04-10',
  array['Alan Bonner','Internal team'],
  'Internal sync — discussed concern about founder reluctance to invest in CRM / automation tooling.',
  array['Founder cited no time to learn new tools objection last call','Current reminder workflow is entirely manual by front desk staff'],
  array['Pitch CRM pilot as part of Sarasota launch, not standalone'],
  '[{"item":"Draft CRM pilot proposal tied to Sarasota","owner":"Alan","deadline":"2026-05-15"}]'::jsonb,
  'internal');

-- ─── Decisions ──────────────────────────────────────────────────────────────
insert into decisions (client_id, date, decision, reason, owner, related, visibility) values
('stroke-scan-plus','2026-04-17','Proceed with Sarasota clinic — target Sept 1 open','Unit economics from Tampa + St. Pete support a third location; demand-test ads in Sarasota showed $11 CPL.','Dr. Patel','Initiative: Open Sarasota clinic','shared'),
('stroke-scan-plus','2026-04-10','Rebuild landing page with risk calculator','Current static LP converts at 12%. Benchmark competitor interactive LP at 18–22%.','Alan Bonner','Initiative: Ship landing page with risk calculator','shared'),
('stroke-scan-plus','2026-03-20','Reject TV sponsorship offer','Pricing was $18k/mo with vague attribution. Same budget reallocated to Meta scaled to $4k ROAS.','Dr. Patel','Marketing channels','shared');

-- ─── Opportunities ──────────────────────────────────────────────────────────
insert into opportunities (client_id, name, description, estimated_impact, difficulty, priority, status, next_step, visibility) values
('stroke-scan-plus','No-show rate — recover 15% of lost bookings','~14% of booked patients no-show. Add 3-touch reminder (48h email, 24h SMS, morning-of call) and deposit on booking.','+$6–9k/mo recovered revenue','easy','high','not_started','Scope 3-touch reminder build in booking tool','internal'),
('stroke-scan-plus','Membership program monetization','Heart Health membership mentioned only in discharge paperwork. Attach rate <2%. Add post-scan email sequence.','+$4k/mo recurring','easy','medium','not_started','Write 5-email post-scan nurture sequence','internal'),
('stroke-scan-plus','Couples package under-marketed','Couples $249 drives 23% lift in AOV when mentioned but buried on page 3 of funnel.','+8% AOV across new patients','easy','medium','in_progress','Ship as part of LP rebuild','shared'),
('stroke-scan-plus','Second reader to unblock capacity','Cardiologist review is the hard cap. At 500 scans/mo unit economics support a second contracted reader.','Unlocks 2x clinic capacity','medium','high','not_started','Maria to build capacity/cost model','internal');

-- ─── Data Room ──────────────────────────────────────────────────────────────
insert into data_room (client_id, file_name, category, description, url, date_added, visibility) values
('stroke-scan-plus','SSP — Brand Guidelines v2.pdf','Brand','Logo, colors, type, tone of voice','#','2026-02-04','shared'),
('stroke-scan-plus','Meta Ads — Q1 Performance.xlsx','Performance','Weekly CPL, ROAS, creative breakdown','#','2026-04-02','shared'),
('stroke-scan-plus','Clinic unit economics model.xlsx','Finance','Per-clinic P&L, capacity, breakeven','#','2026-03-14','internal'),
('stroke-scan-plus','Patient testimonial — M. Jenkins (video)','Creative','Used in top-performing Tampa campaign','#','2026-03-08','shared'),
('stroke-scan-plus','Cardiologist agreement — template','Legal','Used for Sarasota reader negotiation','#','2026-04-11','internal');

-- ─── Tasks ──────────────────────────────────────────────────────────────────
insert into tasks (client_id, name, owner, due_date, status, priority, notes) values
('stroke-scan-plus','Rewrite LP headline + hero copy','Alan Bonner','2026-04-25','in_progress','high','Warmer tone — Dr. Patel feedback'),
('stroke-scan-plus','Build 3-touch no-show reminder','Ops','2026-05-08','not_started','high','Email + SMS + morning-of call'),
('stroke-scan-plus','Draft senior-community partnership one-pager','Alan Bonner','2026-04-24','in_progress','high',''),
('stroke-scan-plus','Scope second-reader economics','Maria','2026-05-05','not_started','medium','Needed before Sarasota signing'),
('stroke-scan-plus','Write post-scan nurture email sequence (5)','Alan Bonner','2026-05-15','not_started','medium','Push membership attach rate'),
('stroke-scan-plus','Review Sarasota lease options','Dr. Patel','2026-04-25','not_started','critical','');

-- ─── Synthesis ──────────────────────────────────────────────────────────────
insert into synthesis (client_id, headline, situation, complication, resolution, key_findings, recommendations, visibility)
values (
  'stroke-scan-plus',
  'Double scan capacity and open Sarasota to unlock the next $1.5M of ARR without diluting brand.',
  'Stroke Scan Plus has proven direct-to-consumer preventive screening at $149 works. Two Florida clinics run at 80% utilization. Meta + Google paid are profitable at $32 CPB.',
  'Current cardiologist review is a hard capacity ceiling at ~80 scans/day across the network. Paid acquisition scales; operations do not. Growth past 500 scans/mo requires structural changes.',
  'Two-track plan: (1) unlock capacity by adding a second contracted cardiologist reader, (2) open a third fixed location in Sarasota where demand-test ads already confirm $11 CPL.',
  array[
    'Unit economics per clinic hit payback at month 9 at current CAC',
    'No-show rate of 14% represents $6–9k/mo leaked revenue',
    'Membership program has <2% attach rate — pure underpenetration',
    'Founder-led brand is asset, not bottleneck'
  ],
  array[
    'Sign second reader contract before Sarasota lease',
    'Ship deposit + 3-touch reminder stack in Q2 — fastest ROI',
    'Build content engine by end of Q3',
    'Defer national expansion until Sarasota hits break-even'
  ],
  'shared'
)
on conflict (client_id) do nothing;

-- ─── Hypotheses ─────────────────────────────────────────────────────────────
-- Simpler seed without parent linking (parent_ids would need UUIDs known
-- in advance; handle parent linking in the app during usage).
insert into hypotheses (client_id, statement, status, owner, evidence, so_what) values
('stroke-scan-plus','Capacity, not demand, is the binding constraint on growth past 500 scans/mo','confirmed','Alan Bonner','Cardiologist review queue hit 3-day SLA breach twice in March. Sarasota demand-test ads returned $11 CPL.','Unblock capacity before investing further in acquisition.'),
('stroke-scan-plus','A second cardiologist reader is economically justified at current volume','in_progress','Maria','At 500 scans/mo, reader cost per scan is $11 hourly, $14 retainer. Both below 10% margin threshold.','Propose hourly-contract reader; model dips below 10% only if scan volume drops 20%+.'),
('stroke-scan-plus','No-show stack recovers 15% of lost bookings','in_progress','Alan Bonner','Industry benchmarks show 30–50% reduction in no-show after deposit adoption. 3-touch reminder alone typically recovers 8–12%.','Pilot in one clinic in May; scale network-wide if no-show rate drops below 10%.'),
('stroke-scan-plus','Membership attach can be lifted from 2% to 15% with post-scan sequence','untested','Alan Bonner','','If confirmed, adds $8–12k/mo recurring at steady state.'),
('stroke-scan-plus','Organic content shifts lead mix from 5% to 20% organic by EOY','untested','Content lead (TBD)','Competitor Life Line gets ~30% organic per SEMrush data.','Reduces blended CAC by 18% and creates defensibility.'),
('stroke-scan-plus','Sarasota will break even by Q2 2027 at current CAC','untested','Founder','Florida clinics broke even at month 9 and 11 respectively.','If break-even slips past month 12, pause national expansion plans.');

-- ─── Deliverables ───────────────────────────────────────────────────────────
insert into deliverables (client_id, name, type, owner, status, due_date, delivered_date, url, notes, visibility) values
('stroke-scan-plus','Q2 Strategic Recommendation — Capacity & Sarasota','deck','Alan Bonner','review','2026-04-25',null,'#','Synthesis + second reader case + Sarasota timeline','shared'),
('stroke-scan-plus','Clinic Unit Economics Model v3','model','Maria','drafting','2026-05-05',null,'#','Add second-reader scenario, Sarasota ramp curve','internal'),
('stroke-scan-plus','Landing Page Copy v2','memo','Alan Bonner','ready','2026-04-20',null,'#','Warmer tone per Dr. Patel feedback','shared'),
('stroke-scan-plus','Senior Community Partnership One-Pager','memo','Alan Bonner','drafting','2026-04-24',null,'#','Target: 8 active-adult communities','shared'),
('stroke-scan-plus','Q1 Performance Report','report','Alan Bonner','delivered','2026-04-05','2026-04-03','#','KPI summary + campaign breakdown + Q2 recommendations','shared');

-- ─── Stakeholders ───────────────────────────────────────────────────────────
insert into stakeholders (client_id, name, role, email, influence, posture, last_contact, notes) values
('stroke-scan-plus','Dr. Raj Patel','Founder & Lead Cardiologist','raj@strokescanplus.com','high','champion','2026-04-17','Decision maker. Prioritizes brand trust over volume. Sensitive to anything aggressive.'),
('stroke-scan-plus','Maria Sanchez','Operations Director','maria@strokescanplus.com','medium','supportive','2026-04-17','Owns clinic operations. Pragmatic. Main day-to-day counterpart.'),
('stroke-scan-plus','Jordan Lee','Marketing Coordinator','jordan@strokescanplus.com','low','supportive','2026-04-15','Executes paid + email. Newer to role, receptive to coaching.'),
('stroke-scan-plus','Mark Reeves','Outside CFO (fractional)','mark@reeves-cfo.com','high','skeptical','2026-03-28','Risk-averse; wants proof before incremental spend.');

-- ─── Risks ──────────────────────────────────────────────────────────────────
insert into risks (client_id, title, description, likelihood, impact, mitigation, owner, status) values
('stroke-scan-plus','Cardiologist bottleneck blocks growth mid-quarter','Current reader workflow caps network at ~80 scans/day. If Sarasota opens before second reader is in place, SLA breaches compound.','high','high','Gate Sarasota opening on signed second-reader contract. Maria building economics model by May 5.','Alan Bonner','mitigating'),
('stroke-scan-plus','Outside CFO blocks Q2 recommendation','Mark Reeves has signaled skepticism about capital spend before Q1 performance is proven.','medium','high','Pre-brief Mark 1:1 before the group meeting. Lead with Q1 performance against plan.','Alan Bonner','open'),
('stroke-scan-plus','Founder burnout risk as clinic lead + ad talent','Dr. Patel is both operator and creative. If he stops producing, paid engine degrades within 4–6 weeks.','medium','high','Build creative bench: 3 patient testimonial videos + 2 staff-led explainers queued by end of Q2.','Jordan Lee','open'),
('stroke-scan-plus','CRM adoption friction from founder','Founder has cited "no time to learn new tools" as objection.','medium','medium','Frame CRM pilot as part of Sarasota launch.','Alan Bonner','open');

-- ─── Client Actions ─────────────────────────────────────────────────────────
insert into client_actions (client_id, item, owner, due_date, status, notes) values
('stroke-scan-plus','Review + respond to Sarasota lease options','Dr. Patel','2026-04-25','not_started','2 options sent; decision required to hold the Sept 1 opening'),
('stroke-scan-plus','Approve second-reader economics model','Dr. Patel + Mark Reeves','2026-05-10','not_started','Maria will present; need sign-off to recruit'),
('stroke-scan-plus','Share Q1 patient satisfaction survey results','Maria','2026-04-30','in_progress','Needed for testimonial creative + brand positioning work'),
('stroke-scan-plus','Intro Alan to mayor''s office (senior-community program)','Dr. Patel','2026-05-01','not_started','');

-- ─── Impact ─────────────────────────────────────────────────────────────────
insert into impacts (client_id, name, category, value_label, value_numeric, realized_date, initiative_link, notes) values
('stroke-scan-plus','Cost per lead reduction (Meta)','efficiency','CPL $11.40 → $8.40',3600,'2026-03-31','Paid campaign optimization','Creative refresh + audience narrowing. Saves ~$3.6k/mo at current spend.'),
('stroke-scan-plus','Show-up rate improvement','revenue','84.2% → 87.3%',2200,'2026-03-31','SMS reminder cadence tweak','Simple cadence change; ~$2.2k/mo incremental revenue.'),
('stroke-scan-plus','Q1 revenue vs. plan','revenue','+$2.3k above plan',2300,'2026-03-31','Overall engagement','March beat goal by $2.3k after two months under plan.'),
('stroke-scan-plus','Projected: Sarasota opening (Q4 2026)','revenue','+$45k MRR at steady state',45000,null,'Open Sarasota clinic','Projection — realized only when clinic hits break-even.'),
('stroke-scan-plus','Projected: No-show stack','revenue','+$6–9k/mo recovered',7500,null,'3-touch no-show reminder build','Projection — pilots in May.');

-- ─── Commercial ─────────────────────────────────────────────────────────────
insert into commercial (client_id, engagement_name, budget_hours, budget_fee, hours_burned, fee_invoiced, start_date, end_date, margin_pct, notes) values
('stroke-scan-plus','Stroke Scan Plus — Growth Engagement, 2026',640,96000,218,36000,'2026-02-01','2026-12-31',42,'Monthly retainer $8k + project scope for Sarasota launch playbook.'),
('greenleaf-dental','Greenleaf Dental — Audit & Phase 1, 2026',120,24000,34,8000,'2026-04-01','2026-07-31',38,'Audit phase; retainer starts post-audit approval')
on conflict (client_id) do nothing;
