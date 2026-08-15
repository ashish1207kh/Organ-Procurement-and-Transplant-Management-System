import React from 'react';
import { FileText, ShieldAlert, Scale, CheckCircle2 } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

export default function TermsAndConditionsPage() {
  const policies = [
    {
      title: '1. Voluntary Informed Consent',
      content: 'Organ donation pledges registered on this platform are strictly voluntary. Donors must be fully informed of the evaluation procedures and retain the unrestricted right to withdraw consent prior to organ procurement.'
    },
    {
      title: '2. Comprehensive Medical Evaluation',
      content: 'All pledged organs and recipient registrations are subject to rigorous clinical laboratory testing, HLA typing, viral serology screening, and surgical viability evaluation conducted by certified medical centers.'
    },
    {
      title: '3. Patient Confidentiality & Data Privacy',
      content: 'Personal health information (PHI) and donor/recipient identities are protected in compliance with healthcare data privacy laws. De-identified matching data is used strictly for organ allocation operations.'
    },
    {
      title: '4. Non-Commercialization & Legal Compliance',
      content: 'In accordance with national and international organ procurement legislation, financial compensation, commercial sale, or material reward for human organs is strictly illegal and prohibited.'
    },
    {
      title: '5. Right to Withdraw Consent',
      content: 'Donors may withdraw their organ donation consent at any time prior to surgical organ procurement through the Donor Portal or written communication with the transplant coordinator.'
    },
    {
      title: '6. Recipient Refusal & Autonomy',
      content: 'Enrolled candidates reserve the right to decline an offered organ match without forfeiting their position on the waiting list, subject to medical evaluation guidelines.'
    },
    {
      title: '7. Medical & Legal Documentation',
      content: 'Surgical procurement and transplantation require verified medical documentation, government identification, and legal consent forms signed by authorized medical authorities.'
    },
    {
      title: '8. Ethical Review & Allocation Policy',
      content: 'Organ matching scores and waiting-list ranks are determined using objective 5-factor compatibility rules (Organ, Blood Group, Urgency, Waiting Time, Proximity) without discrimination based on race, gender, religion, or social standing.'
    }
  ];

  return (
    <MainLayout>
      <div className="py-12 bg-slate-50 min-h-[calc(100vh-10rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-8">
            
            {/* Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Terms & Conditions of Organ Procurement</h1>
                <p className="text-xs text-slate-500">Ethical guidelines, legal compliance, informed consent, and patient privacy standards</p>
              </div>
            </div>

            {/* Academic & Safety Disclaimer Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3 text-xs leading-relaxed">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Demonstration System Notice:</strong>
                <p className="mt-0.5">
                  This application is an academic/demo management system and does not replace professional medical evaluation, transplant authority policies, or clinical decision-making.
                </p>
              </div>
            </div>

            {/* Policies Grid */}
            <div className="space-y-6">
              {policies.map((p) => (
                <div key={p.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-sky-600" />
                    <span>{p.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.content}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
