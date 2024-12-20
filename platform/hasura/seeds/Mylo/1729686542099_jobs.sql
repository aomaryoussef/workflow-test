SET check_function_bodies = false;
INSERT INTO public.jobs (id, name_en, name_ar, unique_identifier, created_at, updated_at) VALUES
(1, 'Business Owner', 'مالك اعمال', 'business-owner', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(2, 'Construction Trades', 'تجارة البناء', 'construction-trades', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(3, 'Engineer', 'مهندس', 'engineer', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(4, 'Finance', 'المالية', 'finance', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(5, 'Governmental Employee', 'موظف حكومي', 'governmental-employee', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(6, 'Healthcare', 'الرعاية الصحية', 'healthcare', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(7, 'Legal', 'قانوني', 'legal', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(8, 'Manager', 'مدير', 'manager', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(9, 'Military', 'الجيش', 'military', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(10, 'Police Officer', 'ضابط شرطة', 'police-officer', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(12, 'Sales', 'مبيعات', 'sales', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(14, 'Teaching', 'مدرس', 'teaching', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(16, 'Other', 'أخري', 'other-employed', '2024-10-16 15:30:40.912833', '2024-10-16 15:30:40.912833')
ON CONFLICT (id) DO NOTHING;
